
class Global {
    constructor(){
        this._itme = {};
    }

    add(id, data){

        this._itme[id] = data;
    }
    get(id){
        return this._itme[id]
    }
}
export default Global;