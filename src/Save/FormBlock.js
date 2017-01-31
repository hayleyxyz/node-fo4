class FormBlock {

    read(io) {
        var idBytes = io.read(3);
        this.idBytes = idBytes;
        this.id = this.extractId(idBytes);

        this.flags = io.readUInt32LE();
        this.type = io.readInt8();
        this.version = io.readInt8();

        var lengthType = (this.type >> 6);

        switch (lengthType) {
            case 0: // int8
                this.deflatedLength = io.readInt8();
                this.inflatedLength = io.readInt8();
                break;

            case 1: // int16
                this.deflatedLength = io.readUInt16LE();
                this.inflatedLength = io.readUInt16LE();
                break;
            case 2: // int32
                this.deflatedLength = io.readUInt32LE();
                this.inflatedLength = io.readUInt32LE();
        }

        this.data = io.read(this.deflatedLength);
    }

    write(io) {
        io.write(this.idBytes); // ID - TODO
        io.writeUInt32LE(this.flags);
        io.writeUInt8(this.type);
        io.writeUInt8(this.version);

        var lengthType = (this.type >> 6);

        switch (lengthType) {
            case 0: // int8
                io.writeUInt8(this.data.length);
                io.writeUInt8(this.inflatedLength); // TODO
                break;

            case 1: // int16
                io.writeUInt16LE(this.data.length);
                io.writeUInt16LE(this.inflatedLength); // TODO
                break;
            case 2: // int32
                io.writeUInt32LE(this.data.length);
                io.writeUInt32LE(this.inflatedLength); // TODO
        }

        io.write(this.data);
    }

    extractId(data) {
        var a, b;

        a = ((data[0] << 16) | (data[1] << 8) | data[2]); // 24-bit int

        if (a == 0xC00000) {
            // TODO
            throw 'Not implemented';
        }
        else {
            if ((a & 0x400000) != 0) {
                b = 0;
            }
            else {
                b = 0xFF000000;
            }

            b |= (a & 0xFF3FFFFF);

            return b >>> 0;
        }
    }

    inflateData() {
        const zlib = require('zlib');
        var def = this.data.slice(2);
        return zlib.inflateRawSync(def);
    }

    get isCompressed() {
        return this.inflatedLength !== 0;
    }

    get typeName() {
        var x = (this.type & 0x3F);

        if(!(x in FormBlock.TYPE_LOOKUP)) {
            return 'UNK_';
        }

        var typeNameIndex = FormBlock.TYPE_LOOKUP[x];

        return FormBlock.TYPE_NAMES[typeNameIndex];
    }

    static get TYPE_LOOKUP() {
        return [
            0x40, 0x41, 0x42, 0x44, 0x45, 0x46, 0x3F, 0x4F, 0x50, 0x2D,
            0x1B, 0x1C, 0x1D, 0x1E, 0x1F, 0x20, 0x21, 0x22, 0x23, 0x24,
            0x26, 0x2A, 0x2B, 0x2C, 0x2F, 0x30, 0x31, 0x32, 0x6A, 0x0D,
            0x0E, 0x52, 0x4C, 0x7A, 0x15, 0x75, 0x7E, 0x6B, 0x7D, 0x49,
            0x48, 0x47, 0x5E, 0x2E, 0x38, 0x55, 0x43, 0x18, 0x37
        ];
    }

    static get TYPE_NAMES() {
        return [
            "NONE", "TES4", "GRUP", "GMST", "KYWD", "LCRT", "AACT", "TRNS",
            "CMPO", "TXST", "MICN", "GLOB", "DMGT", "CLAS", "FACT", "HDPT",
            "EYES", "RACE", "SOUN", "ASPC", "SKIL", "MGEF", "SCPT", "LTEX",
            "ENCH", "SPEL", "SCRL", "ACTI", "TACT", "ARMO", "BOOK", "CONT",
            "DOOR", "INGR", "LIGH", "MISC", "STAT", "SCOL", "MSTT", "GRAS",
            "TREE", "FLOR", "FURN", "WEAP", "AMMO", "NPC_", "LVLN", "KEYM",
            "ALCH", "IDLM", "NOTE", "PROJ", "HAZD", "BNDS", "SLGM", "TERM",
            "LVLI", "WTHR", "CLMT", "SPGD", "RFCT", "REGN", "NAVI", "CELL",
            "REFR", "ACHR", "PMIS", "PARW", "PGRE", "PBEA", "PFLA", "PCON",
            "PBAR", "PHZD", "WRLD", "LAND", "NAVM", "TLOD", "DIAL", "INFO",
            "QUST", "IDLE", "PACK", "CSTY", "LSCR", "LVSP", "ANIO", "WATR",
            "EFSH", "TOFT", "EXPL", "DEBR", "IMGS", "IMAD", "FLST", "PERK",
            "BPTD", "ADDN", "AVIF", "CAMS", "CPTH", "VTYP", "MATT", "IPCT",
            "IPDS", "ARMA", "ECZN", "LCTN", "MESG", "RGDL", "DOBJ", "DFOB",
            "LGTM", "MUSC", "FSTP", "FSTS", "SMBN", "SMQN", "SMEN", "DLBR",
            "MUST", "DLVW", "WOOP", "SHOU", "EQUP", "RELA", "SCEN", "ASTP",
            "OTFT", "ARTO", "MATO", "MOVT", "SNDR", "DUAL", "SNCT", "SOPM",
            "COLL", "CLFM", "REVB", "PKIN", "RFGP", "AMDL", "LAYR", "COBJ",
            "OMOD", "MSWP", "ZOOM", "INNR", "KSSM", "AECH", "SCCO", "AORU",
            "SCSN", "STAG", "NOCM", "LENS", "LSPR", "GDRY", "OVIS"
        ];
    }

}

module.exports = FormBlock;