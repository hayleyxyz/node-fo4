class ApplicationDetails {

    read(io) {
        this.formVersion = io.readInt8();
        this.applicationVersion = io.readPrefixedString();
        this.dataFilesLength = io.readUInt32LE();
        this.dataFilesCount = io.readInt8();

        this.dataFiles = [ ];
        for(var i = 0; i < this.dataFilesCount; i++) {
            var mf = io.readPrefixedString();
            this.dataFiles.push(mf);
        }
    }

    write(io) {
        io.writeUInt8(this.formVersion);
        io.writePrefixedString(this.applicationVersion);

        io.writeUInt32LE(0); // dynamic value

        var dataFilesStart = io.position;

        io.writeUInt8(this.dataFiles.length);
        this.dataFiles.forEach(f => {
            io.writePrefixedString(f);
        });

        var dataFilesLength = (io.position - dataFilesStart);
        
        io.position = dataFilesStart - 4;
        io.writeUInt32LE(dataFilesLength);
        io.position += dataFilesLength;

    }

}

module.exports = ApplicationDetails;