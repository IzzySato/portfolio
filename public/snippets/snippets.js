'use strict';

const getCode = async (file) => {
    return await (await fetch(`/snippets/${file}`)).text();
};

const formatHTML = async (element) => {
    const {dataset: {snippet = ''}} = element;
    if(snippet !== '') {
        const code = await getCode(snippet);
        let formattedCode = '';
        code.split('').forEach(e => {
            if (e === '<') formattedCode += '&lt;';
            else if (e === '>') formattedCode +='&gt;';
            else formattedCode += e;
        });
        element.innerHTML = formattedCode;
    }
};

export {
    formatHTML
}

