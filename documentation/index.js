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
const minify = require('html-minifier').minify;

const templates = {};
const getTemplate = (name) => {
    if (!templates[name]) {
        templates[name] = fs.readFileSync(path.join(__dirname, `templates/${name}.hbs`), { encoding: 'UTF-8' });
    }
    return templates[name];
};

const toHTML = ({ type, value, url, children }) => {
    switch (type) {
        case 'paragraph': return `<p>${children.reduce((d, child) => `${d}${toHTML(child)}`, '')}</p>`;
        case 'link': return `<a href="${url}">${!children.length ? url : children.reduce((d, child) => `${d}${toHTML(child)}`, '')}</a>`;
        case 'emphasis': return `<strong>${children.reduce((d, child) => `${d}${toHTML(child)}`, '')}</strong>`;
        case 'inlineCode': return `<code>${value}</code>`;
        case 'text':
        default: return value;
    }
};

const toMemberHeading = (kind) => {
    switch (kind) {
        case 'enum': return 'Members';
        case 'note': return '';
        default: return 'Methods';
    }
};

const toDescriptionHTML = (description) => {
    if (typeof description !== 'object') return description;
    if (description.type !== 'root') console.log('Irregular description:', description);
    return description.children.reduce((desc, child) => `${desc}${toHTML(child)}`, '');
};

const parseParam = (param) => {
    const { name, type, description, properties } = param;
    const typeName = type.type === 'OptionalType' ?
        type.expression.name :
        type.name;
    const isOptional = type.type === 'OptionalType' || type.type === 'AllLiteral' || param.default;
    return {
        name,
        properties: (properties || []).map(parseParam),
        default: param.default,
        typeName,
        isOptional,
        descriptionHTML: toDescriptionHTML(description),
    };
};

const parseReturn = ({ type, description }) => ({
    typeName: type.name,
    descriptionHTML: toDescriptionHTML(description),
});

const parseMember = ({ name, kind, description, examples, params, type, returns }) => ({
    name,
    kind,
    typeName: type ? type.name : 'Function',
    examples,
    returns: returns.map(parseReturn),
    params: params.map(parseParam),
    descriptionHTML: toDescriptionHTML(description),
});

const parseJSON = ({ name, description, members, kind }) => {
    const hasMembers =
        members.global.length +
        members.inner.length +
        members.instance.length +
        members.events.length +
        members.static.length;
    return {
        name,
        kind,
        members: {
            global: members.global.map(parseMember),
            inner: members.inner.map(parseMember),
            instance: members.instance.map(parseMember),
            events: members.events.map(parseMember),
            static: members.static.map(parseMember),
        },
        hasMembers,
        memberHeading: toMemberHeading(kind),
        descriptionHTML: toDescriptionHTML(description),
    };
};

Handlebars.registerPartial('api', getTemplate('api'));
Handlebars.registerPartial('apiLink', getTemplate('api-link'));
Handlebars.registerPartial('member', getTemplate('member'));
Handlebars.registerPartial('param', getTemplate('param'));
Handlebars.registerPartial('paramHeader', getTemplate('param-header'));

console.log('Starting documentation...');
documentation.build('../src/**', { config: path.join(__dirname, 'documentation.yml') }).then((json) => {
    const index = getTemplate('index');
    const apis = json.map(parseJSON);
    const docs = Handlebars.compile(index)({ apis });
    // const docs = minify(Handlebars.compile(index)({ apis }));
    fs.writeFileSync(path.join(__dirname, 'documentation.raw.json'), JSON.stringify(json));
    fs.writeFileSync(path.join(__dirname, 'documentation.json'), JSON.stringify(apis));
    fs.writeFileSync(path.join(__dirname, 'documentation.html'), docs);
});