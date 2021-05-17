var element = $('#container');
var structName = $("h3").text();
var config = { backgroundColor: 'black' };//#83C576
var viewer = $3Dmol.createViewer( element, config );
var pdbUri = '../Structures/' + structName+'.pdb';
console.log(pdbUri);
jQuery.ajax( pdbUri, {
    success: function(data) {
        let v = viewer;
        v.addModel( data, "pdb" );
        v.setStyle({}, {cartoon: {colorscheme: 'chain'}});
        v.zoomTo();
        v.render();
        v.zoom(1.2, 2000);
    },
    error: function(hdr, status, err) {
        console.error( "Failed to load PDB " + pdbUri + ": " + err );
    }
});