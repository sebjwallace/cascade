import { Component as _Component } from './Component';
import { Store } from './Store';

class RSS{
	constructor(store){
		this.Store = store;
		if(!document.getElementById('rss-container')){
			let el = document.createElement('div');
			el.id = 'rss-container';
			document.body.appendChild(el);
		}
	}
}

const _Event = (id) => {
	const comp = RSSSingleton.Store.events[id].component;
	const selector = RSSSingleton.Store.events[id].selector;
	const styles = {};
	styles[selector] = RSSSingleton.Store.events[id].styles
	comp.setStyles(styles);
};

class ComponentFacade{
	constructor(initial,styles){
		const comp = new _Component(RSSSingleton.Store);
		if(typeof initial == 'string')
			document.getElementById(initial).className = comp.className();
		else if(typeof initial == 'object')
			comp.setStyles(initial);
		if(styles)
			comp.setStyles(styles);
		return comp;
	}
}

export const RSSSingleton = new RSS(new Store);
export const Component = ComponentFacade;
export const Event = _Event;