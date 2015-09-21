/**
 * SiaeTree.js
 */

function SiaeTree(options)
{
	//var data_url = 'data/siae-mock.json' ;
	var data_url = 'data/Codes_ROME-tree.xls.json' ;
	var searchTimeout = 250 ;

	/**
	 * used in event context
	 */
	var self = this;

	this.treeId = options.treeId ;
	this.treejs = $('#'+this.treeId) ;

	this.treeSearch = $('#'+options.treeSearchId) ;

	// Construct the JSTree

	this.treejs.jstree({
		core: {
			multiple: true,
			data: {
				url: options.treeDataUrl,
				dataType : 'json'
			},
			error: function(e){
				alert('Erreur chargement des données (jsTree): '+"\n"+'('+e.id+') '+e.plugin+', '+e.error+': '+e.reason);
			}
		},
		plugins: [
		          "checkbox", "search",
		          // "state" plugin saves all opened and selected nodes in the user's browser,
		          // so when returning to the same tree the previous state will be restored.
		          "state"
		],
		checkbox: {
			three_state: true
		},
		search: {
			show_only_matches: true
		}
	});

	this.treejs.on('select_node.jstree', function(node, selected, event){
		var sno = selected.node.original ;
		if( sno.rome )
			$(self).trigger( 'cartosiae.node_selected', [sno] );
		else
		{
			selected.node.children_d.forEach(function(n){
				n = self.treejs.jstree('get_node', n);
				if( n.original.rome )
					$(self).trigger( 'cartosiae.node_selected', n.original );

			});
		}
	});

	this.treejs.on('deselect_node.jstree', function(node, deselected, event){
		var sno = deselected.node.original ;
		if( sno.rome )
			$(self).trigger( 'cartosiae.node_deselected', [sno] );
		else
		{
			deselected.node.children_d.forEach(function(n){
				n = self.treejs.jstree('get_node', n);
				if( n.original.rome )
					$(self).trigger( 'cartosiae.node_deselected', n.original );
			})			
		}
	});

	/**
	 * Handle clear search
	 */
	$('#'+options.treeSearchClear).on('click', function(e)
	{
		self.treeSearch.val('');
		self.treejs.jstree(true).clear_search();
	});

	/**
	 * Handle select All
	 */
	$('#'+options.treeSelectAllId).on('click',function(e)
	{
		self.treejs.jstree(true).select_all();
	});

	/**
	 * Handle select None
	 */
	$('#'+options.treeSelectNoneId).on('click',function(e)
	{
		//self.treeSearch.val('');
		//self.treejs.jstree(true).clear_search();
		self.treejs.jstree(true).deselect_all();
	});

	/**
	 * Handle JSTree search
	 */
	var searchTimer = false;
	this.treeSearch.keyup(function()
	{
		if (searchTimer) {
			clearTimeout(searchTimer);
		}
		searchTimer = setTimeout(function() {
			console.log('searching: '+v);
			self.treejs.jstree(true).search(v);
		}, self.searchTimeout );
	});

}