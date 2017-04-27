$(document).ready(function(){
	
	// --------------- home page
	
	// buttons actions
	$('#home')
		.on('click', 'button.action-info', function(){
			DGN.app.pageSet('info');
		})
		.on('click', 'button.action-play', function(){
			DGN.app.pageSet('play');
		});
	
	
	// --------------- help page
	
	// buttons actions
	$('#help')
		.on('click', 'button.action-close', function(){
			DGN.app.pageSet('play');
		});
	
	
	// --------------- info page
	var page, innerPages, pagination;
	
	page = $('#info');
	
	
	// buttons actions
	page.on('click', 'button.action-home', function(){
		DGN.app.pageSet('home');
	});
	
	pagination = page.find('.pagination');
	page.find('.inner-page').each(function(index, el){
		$('<div />')
			.on('click', function() {
				DGN.app.pageSet('info', {
					innerIndex: index
				});
			})
			.appendTo(pagination);
	});
	
	
	// --------------- play page
	$('#play')
		.on('click', 'button.action-help', function(){
			DGN.app.pageSet('help');
		});
	
	DGN.app = new DGN.core.Application();
	DGN.app.pageSet('info', {
		innerIndex: 2
	});
});