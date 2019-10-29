// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var fs = require('fs');
var firstline = require("firstline");
const cp = require('child_process');

const autoMLTypes = [
	{
		name:  'Sentiment Analysis (binary-classification)',
		value: 'binary-classification'
	},
	{
		name:  'Issue Classification (multiclass-classification)',
		value: 'multiclass-classification'
	},
	{
		name:  'Price Prediction (regression)',
		value: 'regression'
	},
];


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ml-net-model-builder" is now active!');



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.mlbuilder', async () => {
		// The code you place here will be executed every time your command is executed
		let pickHeader: any;
		let pickLabelColumnIndex: any;
		let labelColumnIndex: any;
		let selectIgnoredColumns: any;
		let ignoredColumns: string = "";

		let _channel = vscode.window.createOutputChannel('ML.NET AutoML');
		let task = await vscode.window.showQuickPick(autoMLTypes.map(item =>{
			return item.name;
		}), {
			placeHolder: 'Pick and ML Task to Run'
		});
		if (!task){
			return;
		}

		const getFile = await vscode.window.showOpenDialog({openLabel: "select DataSet",canSelectFiles: false, filters: {'CSV or TSV': ['csv', 'tsv']}});
		
		if (!getFile) {
			return;
		}
		const filePath = getFile[0].path;
		console.log("Path:", filePath);
		const firstLineDoc = await firstline(filePath);
		let headers: Array<string>;

		switch (filePath.slice(-3)){
			case "tsv":
				headers = firstLineDoc.split("\t");
				break;
			case "csv":
				headers = firstLineDoc.split(",");
			default:
				return;
		}

		const useHeaders = await vscode.window.showQuickPick(['Yes', 'No'], {
			placeHolder: 'File contains a header row?',

		});

		console.log("useHeaders:",useHeaders);
		if(useHeaders === 'Yes') {
			pickHeader = await vscode.window.showQuickPick(headers, {
				placeHolder: 'Pick Label Column:',
			});
			if(!pickHeader){
				return;
			}
			labelColumnIndex = headers.indexOf(pickHeader);

			selectIgnoredColumns = await vscode.window.showQuickPick(headers.filter((item)=>{
				return item !== pickHeader;
			}), {
				placeHolder: 'Select columns to Ignore from the Dataset:',
				canPickMany: true
			});

			if(selectIgnoredColumns.length > 0){

				ignoredColumns = `--ignore-columns ${selectIgnoredColumns.map((item: any) => `"${item}"`).join(',')}`;
			}

		}
		else if(useHeaders === 'No') {
			labelColumnIndex = pickLabelColumnIndex = await vscode.window.showQuickPick(headers.map((item, i)=>{
				return i.toString();
			}), {
				placeHolder: 'Pick Label Column Index:',
			});
			if(!labelColumnIndex){
				return;
			}
		}else{
			return;
		}

		const pickExplorationTime = await vscode.window.showInputBox(
			{ 	placeHolder: '10', 
				prompt: "Max exploration Time? in Seconds..",
				validateInput: text => {
					if(isNaN(parseInt(text))){
						return 'Needs to be a Number';
					}
					else if (parseInt(text) < 1 || parseInt(text) > 1800){
						return 'Needs to be a Number between 1 and 1800';
					}else {
						return null;
					}
				}
			});
		if(!pickExplorationTime){
			return;
		}

		const outputFolder = await vscode.window.showOpenDialog({canSelectFolders: true, openLabel: "Output Here"});

		if(!outputFolder){
			return;
		}

		const outputPath = outputFolder[0].path;

		const task2Run = getTaskValue(task);
		if (!task2Run){
			return;
		}
		const command = `mlnet auto-train --task ${task2Run.value} --label-column-index ${labelColumnIndex} ${ignoredColumns} --has-header ${useHeaders  === 'Yes'}  --dataset "${filePath}" --max-exploration-time ${pickExplorationTime} --output-path ${outputPath}`;
		console.log("Command: ", command);
		_channel.show();
		cp.exec(command,(err: any, stdout: any, stderr: any) => {
			console.log(err);
			_channel.append(stdout);
		});



		// Display a message box to the user
		vscode.window.showInformationMessage('Running ML.NET AutoML!');
	});

	context.subscriptions.push(disposable);

	function getTaskValue(task: string) {
		return autoMLTypes.find(item =>{
			return item.name === task;
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
