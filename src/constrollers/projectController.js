const Project = require('../models/Project');

module.exports = {
    async index(req, res) {
        const { page, limit } = req.query;

        const projects = await Project.paginate({}, { page: page, limit: parseInt(limit) });

        return res.json(projects);
    },

    async show(req, res) {
        try {   
            const project = await Project.findById(req.params.id);

            res.json(project);
        } catch (error) {
            return res.status(400).send({ error: 'project.not.found'});
        }
    },

    async create (req, res) {
        try {
            let data = req.body;

            const projects = await Project.create(data);

            return res.send({ projects });
        } catch(err) {
            return res.status(400).send({error: err});
        }
    },

    async update(req, res) {
        try {

            let data = req.body;

            const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });

            return res.json(project);
        } catch (error) {
            return res.status(400).send({ error: 'was.not.possible.update'});
        }
    },

    async destroy(req, res) {
        const data = await Project.findById(req.params.id);

        try {
            if (data.isDeleted) {
                data.isDeleted = false;
                data.deletedAt = null;
            } else {
                data.isDeleted = true;
                data.deletedAt = Date.now();
            }

            await data.save();
        } catch (error) {
            return res.status(400).send({ error: error});
        }

        return res.status(201).json();
    }
}