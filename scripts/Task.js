export class Task {
    constructor(id, text, completed) {
        this._id = id;
        this._text = text;
        this._completed = completed;
    }
    get text() {
        return this._text;
    }
    set text(value) {
        this._text = value;
    }
    get completed() {
        return this._completed;
    }
    set completed(value) {
        this._completed = value;
    }
    get id() {
        return this._id;
    }
    toJson() {
        return JSON.stringify({
            id: this._id,
            completed: this._completed,
            text: this._text
        });
    }
    static fromJson(json) {
        var parsedJson = JSON.parse(json);
        return new Task(parsedJson.id, parsedJson.text, parsedJson.completed);
    }
}
