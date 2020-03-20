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


// const parseFragment = (fragment) => {
//     const { type, value, url, children } = fragment;
//     console.log('%c type...', 'font-size: 20px; color: #FB15B9FF;', type, children);
//     switch (type) {
//         case 'paragraph': return children.reduce((d, child) => `${d}${parseFragment(child)}`, '');
//         case 'link': return `<a href="${url}">${!children.length ? url : children.reduce((d, child) => `${d}${parseFragment(child)}`, '')}</a>`;
//         case 'emphasis': return `<strong>${children.reduce((d, child) => `${d}${parseFragment(child)}`, '')}</strong>`;
//         case 'text':
//         default: return value;
//     }
// };

// const parseDescription = (description) => {
//     if (typeof description !== 'object') return description;
//     if (description.type !== 'root' || description.children.length !== 1) console.log('Irregular description:', description);
//     return description.children[0].children.reduce((desc, child) => `${desc}${parseFragment(child)}`, '');
// };

// const parseParam = (param) => ({
//     name: param.name,
//     description: parseDescription(param.description),
//     type: param.type.name,
//     default: param.default,
// });

// const parseMethods = (methods) => methods.map(({ name, description, params, examples, returns }) => ({
//     name,
//     description: parseDescription(description),
//     parameters: !params.length ? undefined : params.map(parseParam),
// }));

// const parseJSON = (json) => json.map(({ name, description, members }) => ({
//     name,
//     methods: !members.static.length ? undefined : parseMethods(members.static),
//     description: parseDescription(description),
// }));

Handlebars.registerPartial('apiDocumentation', getTemplate('api-documentation'));
Handlebars.registerPartial('apiLink', getTemplate('api-link'));
Handlebars.registerPartial('description', getTemplate('description'));
Handlebars.registerPartial('method', getTemplate('method'));
Handlebars.registerPartial('param', getTemplate('param'));
Handlebars.registerPartial('type', getTemplate('type'));

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

/* Removes unused keys from the json turned by documentation (the npm lib) */
const blacklist = ['tags', 'position', 'loc'];
const trimJSON = (json) => {
    if (Array.isArray(json)) {
        return json.map(trimJSON);
    }
    if (json && typeof json === 'object') {
        return Object.keys(json).reduce((trimmed, key) => {
            if (!blacklist.includes(key)) {
                trimmed[key] = trimJSON(json[key]);
            }
            return trimmed;
        }, {});
    }
    return json;
};

console.log('Starting documentation...');
documentation.build('../src/**', { config: path.join(__dirname, 'documentation.yml') }).then((json) => {
    const index = getTemplate('index');
    const apis = trimJSON(json);
    const docs = Handlebars.compile(index)({ apis });
    fs.writeFileSync(path.join(__dirname, 'documentation.json'), JSON.stringify(apis));
    fs.writeFileSync(path.join(__dirname, 'documentation.html'), docs);
});