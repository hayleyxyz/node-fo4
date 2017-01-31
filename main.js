const fs = require('fs');
const fo4 = require('./src');


//var io = new FalloutIO('Save1_55E9418F_446F6E6E7920446F6E6F7769747A_Vault111Cryo_000115_20151119040946_1_2.fos', 'r', 0666);
var io = new fo4.FalloutIO('Save6_17EA7C0A_517565656E_DmndPlayerHouse01_241022_20161227024830_130_2.fos', 'r', 0666);
//var io = new FalloutIO('out.fos', 'r', 0666);

var save = new fo4.Save.SaveFile(io);
save.read(io);

/*
var mkdirp = require('mkdirp');
save.idBlocks.forEach(block => {
    var dst = './extracted/id';

    mkdirp.sync(dst);

    var id = ('00000000' + block.id).slice(-8);

    fs.writeFileSync(dst + '/' + id, block.data);
});

save.formBlocks.forEach(block => {
    var dst = './extracted/form/' + block.typeName;

    mkdirp.sync(dst);

    var id = ('00000000' + block.id).slice(-8);

    if(block.isCompressed) {
        fs.writeFileSync(dst + '/' + id, block.inflateData());
    }
    else {
        fs.writeFileSync(dst + '/' + id, block.data);
    }
});
*/

var out = new fo4.FalloutIO('out.fos', 'w', 0666);
save.write(out);

return;