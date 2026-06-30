import { Component } from './Component.js';

export class Project {
    constructor(baseCode = '') {
        this.components = [];
        this.baseCode = baseCode; // El código que está en el textarea
        this._nextId = 0;
    }

    addComponent(type, x, y) {
        const comp = new Component({
            id: this._nextId++,
            type,
            x, y,
            width: type === 'texto' ? 80 : 100,
            height: type === 'texto' ? 24 : 40
        });
        this.components.push(comp);
        return comp;
    }

    removeComponent(id) {
        this.components = this.components.filter(c => c.id !== id);
    }

    updateComponent(id, data) {
        const comp = this.components.find(c => c.id === id);
        if (comp) Object.assign(comp, data);
        return comp;
    }

    getComponent(id) {
        return this.components.find(c => c.id === id);
    }
}