import * as vscode from 'vscode';
import create from './commands/create';

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.executeCommand('setContext', 'createIsActive', true);

	vscode.commands.registerCommand('extension.create', async (params) => {
		const moduleName = await vscode.window.showInputBox({
			value: '',
			placeHolder: 'Provide a name for the module'
		});
		if (moduleName && params) {
			create(moduleName, params.fsPath);
		}else{
			vscode.window.showWarningMessage("Can't add module");
		}
	});
}



export function deactivate() { }
