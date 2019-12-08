import * as vscode from 'vscode';
import create from './commands/create';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vue-module-helper" is now active! wuuut');
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
