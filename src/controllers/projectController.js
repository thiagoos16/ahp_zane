const Project = require('../models/Project');
const Paramater = require('../models/Parameter');
const { ObjectID } = require('mongodb');

const { randomUUID } = require('node:crypto')

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

            const newProject = await Project.create(data);

            // relacionar o novo projeto com todos os outros existentes para cada um dos critérios
            
            const projects = await Project.find();

            let parameters =  await Paramater.find();

            parameters.map(async parameter => {
                const projectsLinkeds = [];

                projects.map(project => {
                    projectsLinkeds.push(
                        {
                            "code": randomUUID(),
                            "projectBase": {
                                _id: project._id,
                                name: project.name
                            },
                            "projectSequent": {
                                _id: newProject._id,
                                name: newProject.name
                            },
                            "value": 0
                        }
                    )

                    const projectsYetLinked = projectsLinkeds.filter(pj => pj.projectBase._id.equals(newProject._id) && pj.projectSequent._id.equals(project._id))

                    if (projectsYetLinked.length == 0) {
                        projectsLinkeds.push(
                            {
                                "code": randomUUID(),
                                "projectBase": {
                                    _id: newProject._id,
                                    name: newProject.name
                                },
                                "projectSequent": {
                                    _id: project._id,
                                    name: project.name
                                },
                                "value": 0
                            }
                        )
                    }
                });
                             
                parameter = await parameter.updateOne({$push: {projects: projectsLinkeds}});
            })

            return res.send({ newProject });
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