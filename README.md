# ML.NET Model Builder for VSCode (Preview)
![Alt Text](https://i.imgur.com/6KzWf7m.gif)
    
-----------------------------------------------------------------------------------------------------------
This is an early preview extension which provides a quick and easy way to to use ML.NET AutoML Features from VSCode.

The idea of the extension is for it to be as close to feature parity with Visual Studio's Model Builder. All features are using the ML.NET Cli to run the operations.

As Features are added to the ML.NET CLI, i'm planning on adding them as needed to the extension. 


## Current Features

- Picking the Scenario to use. Currently (classification, regression)
- Selecting the DataSet File (TSV or CSV)
- Selecting the Predict (Label)
- Ignoring Columns from your dataset
- Selecting the output location of the Model
- Choosing the Train Time.
- Working in Github CodeSpaces

## Planned Features

For planned features you can visit the Project board to see whats coming to the Extension, [Project Board]: https://github.com/franzsilva/MLBuilderVSCode-Source/projects

## Requirements

- .NET Core
- Install the ML.NET Cli (dotnet tool install -g mlnet)


## How to use

- Launch the command pallete
- Run command ML.NET Model Builder (Preview)
- Follow the series of questions

## Known Issues

Currently in Testing. Please create Github Issues to work on any issues you find!. 


-----------------------------------------------------------------------------------------------------------
**Enjoy!**
