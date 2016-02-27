class RSS extends React.Component{
	constructor(props){
		super(props)
		this.key = this.generateKey();
		this.rendered = false;
	}
	generateKey(){
		let key = "";
	    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( let i=0; i < 10; i++ )
	        key += possible.charAt(Math.floor(Math.random() * possible.length));
	    return key;
	}
	setStyles(styles){
		if (typeof styles === 'object') styles = this.parseOBJ(styles);
		this.rendered ? this.updateCSS(styles) : this.renderCSS(styles)
	}
	parseOBJ(obj){
		var sum = "";
		var stitch = function(obj){
			for(var props in obj){
				if (props.match(/^\@[a-z&\-]+$/g)){
					stitch(RSS.getMixin(props.replace('@',''),obj[props]));
				} else{
					sum += props;
					if(typeof obj[props] === 'object'){
						sum+="{"; stitch(obj[props]); sum+="}";
					} else{
						sum+= ":" + obj[props] + ";";
					}
				}
			}
		}
		stitch(obj);
		return sum;
	}
	renderCSS(styles){
		let el = document.createElement('style');
		el.id = "react-styles-" + this.key;
		document.body.insertBefore(el,document.body.lastChild);

		if(styles){
			let initialStylesEl = document.createElement('style');
			initialStylesEl.id = "react-styles-initial-" + this.key;
			initialStylesEl.innerHTML = styles;
			document.body.insertBefore(initialStylesEl,document.body.lastChild);
		}

		this.rendered = true;
	}
	updateCSS(styles){
		let el = document.getElementById('react-styles-' + this.key);
		el.innerHTML = styles;
	}
};
RSS.mixin = (id,fn) => {
	RSS.mixins[id] = fn;
}
RSS.getMixin = (id,params) => {
	return RSS.mixins[id](params);
}
RSS.mixins = {};

module.exports = RSS;