import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import { camelCase, startCase } from 'lodash';
import { window } from 'vscode';

export default async (context: vscode.ExtensionContext, name: string, fsPath: string, module: boolean) => {
    if (name) {
        const normalizedName = normalizeName(name, module);
        const path = `${fsPath}/${normalizedName}`;
        const testPath = `${path}/__tests__/`;

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        if (fs.existsSync(path)) {
            writeTemplate(replaceValues(readFile('template-vue.txt', context), dictGen(name)), name, 'vue', path);
            writeTemplate(replaceValues(readFile('template-ts.txt', context), dictGen(name)), name, 'ts', path);
            writeTemplate(Promise.resolve(''), name, 'scss', path);
            if (module) {
                writeTemplate(replaceValues(readFile('template-route.txt', context), dictGen(name)), `${name}-routes`, 'ts', path);
            }
            fs.mkdir(testPath, () => {
                writeTemplate(replaceValues(readFile('template-unittest.txt', context), dictGen(name)), `${name}-spec`, 'ts', testPath);
            });
        }
    } else {
        window.showWarningMessage("Provide a valid module name");
    }
};

function dictGen(name: string) {
    return { name, pascalCasedName: getPascalName(name) };
}

function getPascalName(name: string) {
    return startCase(camelCase(name)).replace(/ /g, '');
}

function normalizeName(name: string, module: boolean) {
    if (module && vscode.workspace.getConfiguration().get('vmh.addModuleToName')) {
        if (name.endsWith('-module')) {
            return name;
        } else {
            return `${name}-module`;
        }
    } else {
        return name;
    }
}

function writeTemplate(template: Promise<string>, name: string, extension: string, path: string) {
    template.then((parsedTemplate) => {
        fs.writeFile(`${path}/${name}.${extension}`, parsedTemplate, () => { });
    });
}

function readFile(filename: string, context: vscode.ExtensionContext): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(vscode.Uri.file(path.join(context.extensionPath, 'src', 'templates', filename)).fsPath, 'utf8', (err, data) => {
            err ? reject(err) : resolve(data)
        });
    });
}

function replaceValues(filePromise: Promise<string>, replaceDictionary: { [index: string]: string }) {
    return filePromise.then((fileData) => {
        Object.keys(replaceDictionary).forEach((key) => {
            fileData = fileData.replace(new RegExp(`{${key}}`, 'g'), replaceDictionary[key]);
        })
        return fileData;
    });
}