const fs = require('fs');

function getJson(file){
    if (fs.existsSync(file)){
        let rawdata = fs.readFileSync(file);
        let data = JSON.parse(rawdata);
        return data;
    } else {
        console.log(`File '${file}' not found`)
    }
}

function readFile(file){
    if (fs.existsSync(file)){
        let data = fs.readFileSync(file, 'ascii');
        return data;
    } else {
        console.log(`File '${file}' not found`)
    }
}

function createFile(file, textData){
    fs.writeFileSync(file, textData, (err)=>{
        if (err) throw err;
        console.log("done");
    });
}

function makeProject(proj_type){

    let cwd = process.cwd();
    let data = getJson("C:\\Users\\Cross\\Desktop\\project_manager\\src\\config.json");
    
    switch(proj_type){
        case "python":
            let pyFile = `${cwd}\\Program.py`;
            createFile(pyFile, readFile(data['python']));
            createFile(`${cwd}\\run.bat`, `${data['python_interpreter']} ${pyFile}`);
            break;

        case "c#":
            let csFile = `${cwd}\\Program.cs`
            createFile(csFile, readFile(data['csharp']));
            createFile(`${cwd}\\run.bat`, `${data['csharp_compiler']} ${csFile}`);
            break;

        case "javascript":
            let jsFile = `${cwd}\\Program.js`;
            createFile(jsFile, readFile(data['javascript']));
            createFile(`${cwd}\\run.bat`, `${data['javascript_interpreter']} ${cwd}\\Program.js`);
            createFile(`${cwd}\\build.bat`, `${data['javascript_compiler']} ${cwd}\\Program.js`);
            break;
    }
}

function displayHelp(){
    let help = readFile("C:\\Users\\Cross\\Desktop\\project_manager\\src\\help.txt");
    console.log(help);
}

function main(){
    
    let argv = process.argv.slice(2);
    if (argv.length < 1 || argv[0] == "--help"){
        displayHelp();
        return 0;
    }
    for (let i = 0; i < argv.length; i++){
        console.log(argv[i]);
        var current = argv[i];
        
        switch (current){
            case "new":
                if (argv.length >= i + 2){
                    makeProject(argv[i+1]);
                } else{
                    console.log("command 'new' needs a second argument for project name.")
                }
                return 0;
            case "build":
                if (fs.existsSync('build.bat')){
                    require('child_process').exec('cmd /c build.bat', (err) =>{
                        if (err) throw err;
                    });
                }
                break;
            
            default:
                console.log(`'${current}' is not a known command.`);
                console.log("Run --help for help with commands.");
                break;
        }
        
    }


    return 0; // clean exit
}


// SOF
return main();
