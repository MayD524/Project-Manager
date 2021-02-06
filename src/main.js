const fs = require('fs');
const child_process = require('child_process');

function getJson(file){
    if (fs.existsSync(file)){
        let rawdata = fs.readFileSync(file);
        let data = JSON.parse(rawdata);
        return data;
    } else {
        console.log(`File '${file}' not found`)
    }
}

function writeFile(file, data){
    fs.writeFileSync(file, data, (err)=>{
        if (err) throw err;
        console.log("done"); 
    });
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
    console.log(`Creating new file -> ${file}`)
    fs.writeFileSync(file, textData, (err)=>{
        if (err) throw err;
        console.log("done");
    });
    console.log(`Made ${file}`);
}

function writeJSON(file, projName, dir){
    let obj = {
        projects: []
    };
    if(fs.existsSync(file)){
        console.log(`Adding ${projName} to projects.`);
        fs.readFile(file, 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            obj = JSON.parse(data); //now it an object
            obj.projects.push({name:projName, path:dir}); //add some data
            let json = JSON.stringify(obj); //convert it back to json
            writeFile(file, json);
            console.log("Done");
        }});
    } else {
        console.log(`Could not find '${file}'`);
    }
}

function makeProject(proj_type, name){

    let cwd = process.cwd();
    let data = getJson("C:\\ProjectManager\\Project Manager\\src\\config.json");
    
    switch(proj_type){
        case "python":
            let pyFile = `${cwd}\\Program.py`;
            createFile(pyFile, readFile(data['python']));
            createFile(`${cwd}\\run.bat`, `ECHO OFF\n${data['python_interpreter']} ${pyFile}`);
            writeJSON("C:\\ProjectManager\\Project Manager\\src\\projects.json", name, cwd)
            break;

        case "c#":
            let csFile = `${cwd}\\Program.cs`
            createFile(csFile, readFile(data['csharp']));
            createFile(`${cwd}\\run.bat`, `ECHO OFF\n${data['csharp_compiler']} ${csFile}`);
            writeJSON("C:\\ProjectManager\\Project Manager\\src\\projects.json", name, cwd)
            break;

        case "javascript":
            let jsFile = `${cwd}\\Program.js`;
            createFile(jsFile, readFile(data['javascript']));
            createFile(`${cwd}\\run.bat`, `ECHO OFF\n${data['javascript_interpreter']} ${jsFile}`);
            createFile(`${cwd}\\build.bat`, `ECHO OFF\n${data['javascript_compiler']} ${jsFile}`);
            writeJSON("C:\\ProjectManager\\Project Manager\\src\\projects.json", name, cwd)
            break;
        
        case "go":
            let goFile = `${cwd}\\Program.go`;
            createFile(goFile, readFile(data['go']));
            createFile(`${cwd}\\run.bat`, `ECHO OFF\n${data['go_run']} ${goFile}`);
            createFile(`${cwd}\\build.bat`, `ECHO OFF\n${data['go_compile']} ${goFile}`);
            writeJSON("C:\\ProjectManager\\Project Manager\\src\\projects.json", name, cwd)
            break;
    }
}

function displayHelp(){
    let help = readFile("C:\\ProjectManager\\Project Managersrc\\help.txt");
    console.log(help);
}

function rand(){
    let num = Math.floor(Math.random() * 100000) + 1;
    return num.toString();
}

function main(){
    
    let argv = process.argv.slice(2);
    if (argv.length < 1 || argv[0] == "--help"){
        displayHelp();
        return 0;
    }
    //fixed batch file execution
    for (let i = 0; i < argv.length; i++){
        var current = argv[i];
        
        switch (current){
            case "new":
                if (argv.length >= i + 2){
                    if (argv.length >= i +3){
                        makeProject(argv[i+1], argv[i+2]);
                    }else{
                        makeProject(argv[i+1], rand());
                    }
                    
                } else{
                    console.log("command 'new' needs a second argument for project name.")
                }
                return 0;

            case "build":
                if (fs.existsSync('build.bat')){
                    child_process.exec("build.bat", function(err, stdout, stderr){
                        if (err) throw new err;
                        if (stderr) throw new stderr;
                        console.log(stdout);
                    });
                } else {
                    console.log("build file not found");
                }
                break;
            
            case "run":
                if (fs.existsSync("run.bat")){
                    child_process.exec("run.bat", function(err, stdout, stderr){
                        if (err) throw new err;
                        if (stderr) throw new stderr;
                        console.log(stdout);
                    });
                } else {
                    console.log("Cannot find a run.bat file");
                }
                break;

            case "find":
                if (argv.length >= i + 2){

                } else {
                    console.log("Command 'find' needs a second arguemnet");
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
main();
