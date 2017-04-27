$(document).ready(function(){
	var ppage, p;
	
	KPF.utils.log('---------------------------------- DOCUMENT READY');
	
	
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
	ppage = $('#info');
	
	// buttons actions
	ppage.on('click', 'button.action-home', function(){
			DGN.app.pageSet('home');
		});
	
	p = ppage.find('pagination');
	ppage.children('.inner-page').each(function(index, el){
		$('<div>' + index + '</div>')
	});
	
	
	// --------------- play page
	$('#play')
		.on('click', 'button.action-help', function(){
			DGN.app.pageSet('help');
		});
	
	
	
	DGN.app = new DGN.core.Application('info');
});