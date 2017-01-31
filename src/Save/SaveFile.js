const Header = require('./Header.js');
const Screenshot = require('./Screenshot.js');
const ApplicationDetails = require('./ApplicationDetails.js');
const Index = require('./Index.js');
const IdBlock = require('./IdBlock.js');
const FormBlock = require('./FormBlock.js');
const IdList = require('./IdList.js');

class SaveFile {

    read(io) {
        this.header = new Header();
        this.header.read(io);

        this.screenshot = new Screenshot();
        this.screenshot.read(io);

        this.appInfo = new ApplicationDetails();
        this.appInfo.read(io);

        this.index = new Index();
        this.index.read(io);

        this.idBlocks = [ ];

        io.position = this.index.offset3;
        this.readIdBlocks(io, this.index.blockCount1);

        io.position = this.index.offset4;
        this.readIdBlocks(io, this.index.blockCount2);

        io.position = this.index.offset6;
        this.readIdBlocks(io, this.index.blockCount3);

        this.formBlocks = [ ];
        io.position = this.index.offset5;
        this.readFormBlocks(io, this.index.blockCount4);

        this.idList = new IdList();
        io.position = this.index.offset1;
        this.idList.read(io);

        io.position = this.index.offset2;
        this.miscBlock2 = io.read(io.size - this.index.offset2);
    }

    readIdBlocks(io, count) {
        for(var i = 0; i < count; i++) {
            var idBlock = new IdBlock();
            idBlock.read(io);
            this.idBlocks.push(idBlock);
        }
    }

    readFormBlocks(io, count) {
        for(var i = 0; i < count; i++) {
            var formBlock = new FormBlock();
            formBlock.read(io);
            this.formBlocks.push(formBlock);
        }
    }

    write(io) {
        this.header.write(io);
        this.screenshot.write(io);
        this.appInfo.write(io);

        var index = new Index();
        var indexPosition = io.position;

        // write blank index entries
        for(var i = 0; i < 25; i++) {
            io.writeUInt32LE(0);
        }

        index.offset3 = io.position;
        index.blockCount1 = 0;
        this.idBlocks.forEach(block => {
            if(block.id < 100) {
                block.write(io);
                index.blockCount1++;
            }
        });

        index.offset4 = io.position;
        index.blockCount2 = 0;
        this.idBlocks.forEach(block => {
            if(block.id >= 100 && block.id < 1000) {
                block.write(io);
                index.blockCount2++;
            }
        });

        index.offset5 = io.position;
        index.blockCount4 = 0;
        this.formBlocks.forEach(block => {
            block.write(io);
            index.blockCount4++;
        });

        index.offset6 = io.position;
        index.blockCount3 = 0;
        this.idBlocks.forEach(block => {
            if(block.id >= 1000) {
                block.write(io);
                index.blockCount3++;
            }
        });

        index.offset1 = io.position;
        this.idList.write(io);

        index.offset2 = io.position;
        io.write(this.miscBlock2);

        io.position = indexPosition;
        index.write(io);
    }

}

module.exports = SaveFile;