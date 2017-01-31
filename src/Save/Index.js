class Index {

    read(io) {
        this.offset1 = io.readUInt32LE();
        this.offset2 = io.readUInt32LE();
        this.offset3 = io.readUInt32LE();
        this.offset4 = io.readUInt32LE();
        this.offset5 = io.readUInt32LE();
        this.offset6 = io.readUInt32LE();

        this.blockCount1 = io.readUInt32LE();
        this.blockCount2 = io.readUInt32LE();
        this.blockCount3 = io.readUInt32LE();
        this.blockCount4 = io.readUInt32LE();
    }

    write(io) {
        console.log(this.offset1, io.position);

        io.writeUInt32LE(this.offset1);
        io.writeUInt32LE(this.offset2);
        io.writeUInt32LE(this.offset3);
        io.writeUInt32LE(this.offset4);
        io.writeUInt32LE(this.offset5);
        io.writeUInt32LE(this.offset6);

        io.writeUInt32LE(this.blockCount1);
        io.writeUInt32LE(this.blockCount2);
        io.writeUInt32LE(this.blockCount3);
        io.writeUInt32LE(this.blockCount4);
    }

}

module.exports = Index;