import * as vscode from 'vscode';
import create from './commands/create';

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.executeCommand('setContext', 'createIsActive', true);

	vscode.commands.registerCommand('vmh.addModule', async (params) => {
		const moduleName = await vscode.window.showInputBox({
			value: '',
			placeHolder: 'Provide a name for the module'
		});
		if (moduleName && params) {
			create(context, moduleName, params.fsPath, true);
		}else{
			vscode.window.showWarningMessage("Can't add module");
		}
	});

	vscode.commands.registerCommand('vmh.addComponent', async(params) => {
		const moduleName = await vscode.window.showInputBox({
			value: '',
			placeHolder: 'Provide a name for the component'
		});
		if (moduleName && params) {
			create(context, moduleName, params.fsPath, false);
		}else{
			vscode.window.showWarningMessage("Can't add component");
		}
	})
}



export function deactivate() { }
