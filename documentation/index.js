// Psuedocode:
// Document relevant files to JSON form
// Parse JSON format to Handlerbars ready objects
// Generate HTML with Handlerbars
// Use these libs:
// https://github.com/markedjs/marked
// https://highlightjs.org/download/


const fs = require('fs');
const path = require('path');
const documentation = require('documentation');
const Handlebars = require('handlebars');

const templates = {};
const getTemplate = (name) => {
    if (!templates[name]) {
        templates[name] = fs.readFileSync(path.join(__dirname, `templates/${name}.hbs`), { encoding: 'UTF-8' });
    }
    return templates[name];
};


const parseFragment = (fragment) => {
    const { type, value, url, children } = fragment;
    console.log('%c type...', 'font-size: 20px; color: #FB15B9FF;', type, children);
    switch (type) {
        case 'paragraph': return children.reduce((d, child) => `${d}${parseFragment(child)}`, '');
        case 'link': return `<a href="${url}">${!children.length ? url : children.reduce((d, child) => `${d}${parseFragment(child)}`, '')}</a>`;
        case 'emphasis': return `<strong>${children.reduce((d, child) => `${d}${parseFragment(child)}`, '')}</strong>`;
        case 'text':
        default: return value;
    }
};

const parseDescription = (description) => {
    if (typeof description !== 'object') return description;
    if (description.type !== 'root' || description.children.length !== 1) console.log('Irregular description:', description);
    return description.children[0].children.reduce((desc, child) => `${desc}${parseFragment(child)}`, '');
};

const parseParam = (param) => ({
    name: param.name,
    description: parseDescription(param.description),
    type: param.type.name,
    default: param.default,
});

const parseMethods = (methods) => methods.map(({ name, description, params, examples, returns }) => ({
    name,
    description: parseDescription(description),
    parameters: !params.length ? undefined : params.map(parseParam),
}));

const parseJSON = (json) => json.map(({ name, description, members }) => ({
    name,
    methods: !members.static.length ? undefined : parseMethods(members.static),
    description: parseDescription(description),
}));

Handlebars.registerPartial('method', getTemplate('method'));
Handlebars.registerPartial('param', getTemplate('param'));


console.log('Starting documentation...');
documentation.build('../src/**', { config: path.join(__dirname, 'documentation.yml') }).then((json) => {
    console.log('%c some json?', 'font-size: 20px; color: #FB15B9FF;', json);
    const libs = parseJSON(json);
    const index = getTemplate('index');
    const docs = Handlebars.compile(index)({ libs });
    fs.writeFileSync(path.join(__dirname, 'documentation.html'), docs);
});