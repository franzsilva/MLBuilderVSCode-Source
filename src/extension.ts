import * as vscode from 'vscode';
import { runQuickVersion } from './quickversion/quick';



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

		const chooseVersion = await vscode.window.showQuickPick(['Quick (Simple interface)', 'Fancy (User Friendly Interface)'], {
			placeHolder: 'Choose what version you would like to execute',

		});

		if (chooseVersion === "Quick (Simple interface)") {
			await runQuickVersion();
		} 
		else if (chooseVersion === "Fancy (User Friendly Interface)") {
			console.log("In Progress");
		} 
		else {
			return;
		}


	});

	context.subscriptions.push(disposable);


}

// this method is called when your extension is deactivated
export function deactivate() { }
