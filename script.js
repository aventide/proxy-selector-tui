const fs = require('fs')
const term = require('terminal-kit').terminal;

term("Collecting available proxy info...")
const pjson = require('./package.json');
term.clear()

// get package.json proxy entries
const proxyKeys = Object.keys(pjson).filter(k => k.startsWith('proxy'))

// get associated values for proxy entries
// may have to do additional text processing here
const proxyValues = proxyKeys.map(k => pjson[k])

term('Select a gateway proxy: \n')
term.singleColumnMenu(proxyValues, {

}, (error, response) => {

    const selectedProxy = response.selectedText
    const notSelectedProxies = proxyValues.filter(k => k !== selectedProxy)

    term("Not selected: ")
    term(notSelectedProxies)

    term( '\n' ).eraseLineAfter.green(
		"Selected: %s\n" ,
		selectedProxy,
	) ;

    writePJProxies(pjson, selectedProxy, notSelectedProxies)

    term.processExit()
})

function writePJProxies(originalJSON, selectedProxy, notSelectedProxies) {

    // we need to remove the old proxy entries
    proxyKeys.forEach(k => {
        delete originalJSON[k]
    })

    const newJSON = {
        ...originalJSON,
        proxy: selectedProxy,
    }

    notSelectedProxies.forEach(nsp => {
        newJSON["proxy-" + nsp] = nsp
    })

    fs.writeFileSync('package.json', JSON.stringify(newJSON, null, 2), () => {})
}

term.on( 'key' , function( key) {
    if ( key === 'CTRL_C' ) { process.exit() ; }
} ) ;