$(document).ready(function(){
	
	KPF.utils.log('---------------------------------- DOCUMENT READY');
	
	
	
	$('#home')
		.on('click', 'button.action-info', function(){
			DGN.app.pageSet('info');
		})
		.on('click', 'button.action-play', function(){
			DGN.app.pageSet('play');
		});
	
	$('#help')
		.on('click', 'button.action-close', function(){
			DGN.app.pageSet('play');
		});
	
	$('#info')
		.on('click', 'button.action-home', function(){
			DGN.app.pageSet('home');
		});
	
	$('#play')
		.on('click', 'button.action-help', function(){
			DGN.app.pageSet('help');
		});
	
	
	
	DGN.app = new DGN.core.Application('info');
});