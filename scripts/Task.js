export class Task
{
    #text;
    #completed;
    #id;

    constructor(id, text, completed)
    {
        this.#id = id;
        this.#text = text;
        this.#completed = completed;
    }

    get text() 
    {
        return this.#text;
    }

    set text(value)
    {
        this.#text = value;
    }
    
    get completed() 
    {
        return this.#completed;
    }

    set completed(value)
    {
        this.#completed = value;
    }

    get id()
    {
        return this.#id;
    }

    toJson()
    {
        return JSON.stringify({
            id: this.#id,
            completed: this.#completed,
            text: this.#text
        });
    }

    static fromJson(json)
    {
        var parsedJson = JSON.parse(json);
        return new Task(parsedJson.id, parsedJson.text, parsedJson.completed);
    }
}