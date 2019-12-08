import * as fs from 'fs';
import { camelCase, startCase } from 'lodash';

export default async (moduleName: string, fsPath: string) => {
    if (moduleName) {
        const normalizedName = normalizeName(moduleName);
        const modulePath = `${fsPath}/${normalizedName}`;
        if (!fs.existsSync(modulePath)) {
            fs.mkdirSync(modulePath);
        }

        if (fs.existsSync(modulePath)) {
            fs.writeFile(`${modulePath}/${moduleName}.vue`, getVue(moduleName), () => { });
            fs.writeFile(`${modulePath}/${moduleName}.ts`, getTypescript(moduleName), () => { });
            fs.writeFile(`${modulePath}/${moduleName}.html`, getHtml(moduleName), () => { });
            fs.writeFile(`${modulePath}/${moduleName}-routes.ts`, getRoute(moduleName), () => { });

            fs.mkdir(`${modulePath}/tests/`, () => {
                fs.writeFile(`${modulePath}/tests/${moduleName}.spec.ts`, getUnitTest(moduleName), () => { });
            });
        }
    }
}

function normalizeName(moduleName: string) {
    if (moduleName.endsWith('-module')) {
        return moduleName;
    } else {
        return `${moduleName}-module`;
    }
}

function getVue(moduleName: string) {
    return `<template src="./${moduleName}.html">
</template>

<script lang="ts" src="./${moduleName}.ts">
</script>

<style lang="scss">
@import "./${moduleName}.scss";
</style>
	`;
}

function getTypescript(moduleName: string) {
    const pascalCasedName = startCase(camelCase(moduleName)).replace(/ /g, '');
    return `import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ${pascalCasedName} extends Vue {

}
`;
}

function getRoute(moduleName: string) {
    return `import { RouteConfig } from 'vue-router';

export default [{
	path: '/${moduleName}',
	name: '${moduleName}',
	component: () => import('./${moduleName}'),
}] as RouteConfig[];

`;
}

function getHtml(moduleName: string) {
    return `<div>
	${moduleName} created!
</div>
`;
}

function getUnitTest(moduleName: string) {
    const pascalCasedName = startCase(camelCase(moduleName)).replace(/ /g, '');
    return `import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import ${pascalCasedName} from '../${moduleName}';
import WebComponents from '@/plugins/webComponents';

describe('${pascalCasedName}', () => {
	const localVue = createLocalVue();
	localVue.use(WebComponents);

	let wrapper: Wrapper<${pascalCasedName}>;
	beforeEach(() => {
		wrapper = shallowMount(${pascalCasedName}, {
			propsData: {},
			localVue,
		});
	});

	it('Test written for ${moduleName}', () => {
		throw new Error('No test written');
	});
});
`;
}