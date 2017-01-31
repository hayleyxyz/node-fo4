class IdBlock {

    read(io) {
        this.id = io.readUInt32LE();

        var length = io.readUInt32LE();
        this.data = io.read(length);
    }

    write(io) {
        io.writeUInt32LE(this.id);
        io.writeUInt32LE(this.data.length);
        io.write(this.data);
    }

}

module.exports = IdBlock;