class Screenshot {

    read(io) {
        this.width = io.readUInt32LE();
        this.height = io.readUInt32LE();
        this.pixelData = io.read(this.pixelDataLength);
    }

    write(io) {
        if(this.pixelDataLength !== this.pixelData.length) {
            throw 'width/height doesn\'t match pixel data length';
        }

        io.writeUInt32LE(this.width);
        io.writeUInt32LE(this.height);
        io.write(this.pixelData);
    }

    get pixelDataLength() {
        return this.width * this.height * 4;
    }

}

module.exports = Screenshot;