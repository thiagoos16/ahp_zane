const Paramater = require('../models/Parameter');
const Project = require('../models/Project');

const { randomUUID } = require('node:crypto')

module.exports = {
    async index(req, res) {
        const { page, limit } = req.query;

        const projects = await Paramater.paginate({}, { page: page, limit: parseInt(limit) });

        return res.json(projects);
    },

    async show(req, res) {
        try {   
            const paramater = await Paramater.findById(req.params.id);

            res.json(paramater);
        } catch (error) {
            return res.status(400).send({ error: 'paramater.not.found'});
        }
    },

    async create (req, res) {
        try {
            const projects = await Project.find();

            const projectsLinkeds = [];

            projects.map(projectBase => {
                projects.map(projectSequent => {
                    projectsLinkeds.push(
                        {
                            "code": randomUUID(),
                            "projectBase": {
                                _id: projectBase._id,
                                name: projectBase.name
                            },
                            "projectSequent": {
                                _id: projectSequent._id,
                                name: projectSequent.name
                            },
                            "value": 0
                        }
                    )
                })
            });

            let data = req.body;

            let paramater = await Paramater.create(data);

            paramater = await paramater.updateOne({$push: {projects: projectsLinkeds}});
            
            return res.send({ paramater });
        } catch(err) {
            console.log(err)
            return res.status(400).send(err);
        }
    },

    async update(req, res) {
        try {

            let data = req.body;

            const paramater = await paramater.findByIdAndUpdate(req.params.id, data, { new: true });

            return res.json(paramater);
        } catch (error) {
            return res.status(400).send({ error: 'was.not.possible.update'});
        }
    },

    async destroy(req, res) {
        const data = await Paramater.findById(req.params.id);

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