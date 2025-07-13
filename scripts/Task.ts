export class Task
{
    private _text: string;
    private _completed: boolean;
    private _id: number;

    constructor(id: number, text: string, completed: boolean)
    {
        this._id = id;
        this._text = text;
        this._completed = completed;
    }

    public get text() 
    {
        return this._text;
    }

    public set text(value: string)
    {
        this._text = value;
    }
    
    public get completed() 
    {
        return this._completed;
    }

    public set completed(value: boolean)
    {
        this._completed = value;
    }

    public get id()
    {
        return this._id;
    }

    public toJson(): string
    {
        return JSON.stringify({
            id: this._id,
            completed: this._completed,
            text: this._text
        });
    }

    public static fromJson(json: string): Task
    {
        var parsedJson = JSON.parse(json);
        return new Task(parsedJson.id, parsedJson.text, parsedJson.completed);
    }
}