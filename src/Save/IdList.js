class IdList {

    read(io) {
        this.list1 = [ ];

        var count = io.readUInt32LE();
        for(var i = 0; i < count; i++) {
            this.list1.push(io.readUInt32LE());
        }

        this.list2 = [ ];

        count = io.readUInt32LE();
        for(var i = 0; i < count; i++) {
            this.list2.push(io.readUInt32LE());
        }
    }

    write(io) {
        io.writeUInt32LE(this.list1.length);

        this.list1.forEach(id => {
            io.writeUInt32LE(id);
        });


        io.writeUInt32LE(this.list2.length);

        this.list2.forEach(id => {
            io.writeUInt32LE(id);
        });
    }

}

module.exports = IdList;