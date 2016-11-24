//custom control
window.app = {};
var app = window.app;

app.CustomToolbarControl = function(opt_options) {

	var options = opt_options || {};

	var tipLabel = options.tipLabel ? options.tipLabel : 'Legend';

	this.mapListeners = [];

	this.hiddenClassName = 'ol-unselectable ol-control ol3-mycontrol';
	if (ol.control.LayerSwitcher.isTouchDevice_()) {
		this.hiddenClassName += ' touch';
	}
	this.shownClassName = this.hiddenClassName + ' shown';

	var element = document.createElement('div');
	element.className = this.hiddenClassName;

	var button = document.createElement('button');
	button.setAttribute('title', tipLabel);
	element.appendChild(button);

	this.panel = document.createElement('div');
	this.panel.className = 'panel';
	element.appendChild(this.panel);
	ol.control.LayerSwitcher.enableTouchScroll_(this.panel);

	var this_ = this;

	button.onclick = function(e) {
		e = e || window.event;
		this_.showPanel();
		e.preventDefault();
	};

	ol.control.Control.call(this, {
		element : element,
		target : options.target
	});

};
ol.inherits(app.CustomToolbarControl, ol.control.Control);