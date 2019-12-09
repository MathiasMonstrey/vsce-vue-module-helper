import * as vscode from 'vscode';
import create from './commands/create';

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.executeCommand('setContext', 'createIsActive', true);

	vscode.commands.registerCommand('extension.create', async (params) => {
		const moduleName = await vscode.window.showInputBox({
			value: '',
			placeHolder: 'Provide a name for the module'
		});
		if (moduleName) {
			create(moduleName, params.fsPath);
		}
	});
}



export function deactivate() { }
