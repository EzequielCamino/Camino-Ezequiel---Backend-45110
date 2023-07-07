class MongoService {
    constructor(model){
        this.model = model;
    }
    async getAll() {
        try {
            const entities = await this.model.find();
            return entities.map((e)=> e.toObject());
        } catch (error) {
            throw error;
        }
    }
    async create(entity){
        try {
            const newEntity = this.model.create(entity);
            return newEntity;
        } catch (error) {
            throw error;
        }
    }
    async findById(id){
        try {
            const entity = await this.model.findById(id);
            return entity;
        } catch (error) {
            throw error;
        }
    }
    async findByIdAndUpdate(id, entity){
        try {
            const updatedEntity = await this.model.findByIdAndUpdate(id, entity);
            return updatedEntity;
        } catch (error) {
            throw error;
        }
    }
    async findByIdAndDelete(id){
        try {
            const deletedEntity = await this.model.findByIdAndDelete(id);
            return deletedEntity;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MongoService;

