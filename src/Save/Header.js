const FileTime = require('win32filetime');

class Header {

    static get SIGNATURE() {
        return 'FO4_SAVEGAME';
    }

    read(io) {
        this.signature = io.read(Header.SIGNATURE.length);
        this.headerLength = io.readUInt32LE();
        this.saveVersion = io.readUInt32LE();
        this.saveNumber = io.readUInt32LE();
        this.playerName = io.readPrefixedString();
        this.playerLevel = io.readUInt32LE();
        this.locationName = io.readPrefixedString();
        this.playDurationString = io.readPrefixedString();
        this.playerRaceString = io.readPrefixedString();
        this.playerSex = io.readUInt16LE();
        this.playerExp = io.readFloatLE();
        this.playerRequiredExp = io.readFloatLE();

        var lo = io.readUInt32LE();
        var hi = io.readUInt32LE();
        this.saveDateTime = FileTime.toDate({ low: lo, high: hi }); // field is not accounted in the headerLength value
    }

    write(io) {
        var headerStart = io.position;

        io.write(this.signature);
        io.writeUInt32LE(0); // dynamic value
        io.writeUInt32LE(this.saveVersion);
        io.writeUInt32LE(this.saveNumber);
        io.writePrefixedString(this.playerName);
        io.writeUInt32LE(this.playerLevel);
        io.writePrefixedString(this.locationName);
        io.writePrefixedString(this.playDurationString);
        io.writePrefixedString(this.playerRaceString);
        io.writeUInt16LE(this.playerSex);
        io.writeFloatLE(this.playerExp);
        io.writeFloatLE(this.playerRequiredExp);

        var headerLength = (io.position - headerStart);
        io.position = headerStart + this.signature.length;
        io.writeUInt32LE(headerLength);

        io.position = headerLength;
        var ft = FileTime.fromDate(this.saveDateTime);
        io.writeUInt32LE(ft.low);
        io.writeUInt32LE(ft.high);
    }

}

module.exports = Header;