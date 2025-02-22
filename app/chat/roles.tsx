const roles = {
    "Software Engineer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                github: true,
                linkedin: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "JavaScript",
                        "React",
                        "Node.js",
                        "Python",
                        "SQL",
                        "Git"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "jobTitle",
                        "duration",
                        "responsibilities",
                        "techStack"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "technologies",
                        "githubLink",
                        "liveLink"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                },
                certifications: {
                    required: false,
                    fields: [
                        "certificationName",
                        "issuingOrganization",
                        "year"
                    ]
                }
            }
        }
    },

    "Data Scientist": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "Python",
                        "R",
                        "SQL",
                        "Machine Learning",
                        "TensorFlow",
                        "PyTorch",
                        "Statistical Analysis"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "jobTitle",
                        "duration",
                        "projectsHandled",
                        "algorithms"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "modelAccuracy",
                        "technologies",
                        "datasetUsed"
                    ]
                },
                research: {
                    required: false,
                    fields: [
                        "paperTitle",
                        "publication",
                        "year",
                        "abstract"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "specialization",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    },

    "UX Designer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                portfolio: true,
                behance: true
            },
            sections: {
                skills: {
                    required: true,
                    suggestions: [
                        "Figma",
                        "Adobe XD",
                        "Sketch",
                        "User Research",
                        "Prototyping",
                        "Wireframing"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "projectsDelivered",
                        "impact"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "problemStatement",
                        "solution",
                        "userResearch",
                        "projectLink"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear"
                    ]
                }
            }
        }
    },

    "Data Analyst": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true,
                github: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "Python",
                        "R",
                        "Excel",
                        "Tableau",
                        "Power BI",
                        "SQL"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "dataMetricsImproved",
                        "analyticsTools"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "problemSolved",
                        "dataSources",
                        "visualizationTools",
                        "impact"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    },

    "Full-Stack Web Developer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                github: true,
                linkedin: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "React",
                        "Node.js",
                        "MongoDB",
                        "HTML/CSS",
                        "APIs",
                        "UX Design"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "responsibilities",
                        "stackUsed"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "frontend",
                        "backend",
                        "link"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    },

    "UI/UX Developer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                portfolio: true,
                behance: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "Figma",
                        "Adobe XD",
                        "HTML/CSS",
                        "Responsive Design",
                        "Animation"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "projectsDelivered",
                        "designSystem"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "tools",
                        "testing",
                        "link"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear"
                    ]
                }
            }
        }
    },

    "DevOps Engineer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true,
                github: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "AWS",
                        "Docker",
                        "Kubernetes",
                        "Jenkins",
                        "Ansible"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "pipelinesDeployed",
                        "infrastructureManaged"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "description",
                        "tools",
                        "automations",
                        "link"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    },

    "Product Manager": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true
            },
            sections: {
                strategicSkills: {
                    required: true,
                    suggestions: [
                        "Agile",
                        "Customer Research",
                        "Feature Prioritization",
                        "KPIs",
                        "Keynote"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "productsLaunched",
                        "metricsImpact"
                    ]
                },
                achievements: {
                    required: true,
                    fields: [
                        "title",
                        "description",
                        "metrics",
                        "year"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear"
                    ]
                }
            }
        }
    },

    "Digital Marketer": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true,
                portfolio: true
            },
            sections: {
                skills: {
                    required: true,
                    suggestions: [
                        "SEO",
                        "SEM",
                        "Social Media",
                        "Content Writing",
                        "Google Analytics"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "campaignsLed",
                        "toolsUsed"
                    ]
                },
                projects: {
                    required: true,
                    fields: [
                        "projectName",
                        "goals",
                        "audience",
                        "results",
                        "link"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear"
                    ]
                }
            }
        }
    },

    "Cybersecurity Analyst": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true,
                github: true
            },
            sections: {
                technicalSkills: {
                    required: true,
                    suggestions: [
                        "Ethical Hacking",
                        "Forensics",
                        "Pen Testing",
                        "Threat Modeling",
                        "SIEM Tools"
                    ]
                },
                workExperience: {
                    required: true,
                    fields: [
                        "companyName",
                        "role",
                        "duration",
                        "incidentsHandled",
                        "toolsUsed"
                    ]
                },
                certifications: {
                    required: true,
                    fields: [
                        "certificationName",
                        "issuingOrganization",
                        "year"
                    ]
                },
                education: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    },

    "default": {
        required: {
            basicInfo: {
                name: true,
                email: true,
                phone: true,
                linkedin: true
            },
            sections: {
                professionalSkills: {
                    required: true,
                    suggestions: [
                        "Communication",
                        "Teamwork",
                        "Problem Solving",
                        "Leadership",
                        "Time Management"
                    ]
                },
                professionalExperience: {
                    required: true,
                    fields: [
                        "role",
                        "company",
                        "duration",
                        "responsibilities",
                        "achievements"
                    ]
                },
                professionalProjects: {
                    required: true,
                    fields: [
                        "projectTitle",
                        "description",
                        "role",
                        "results",
                        "link"
                    ]
                },
                professionalEducation: {
                    required: true,
                    fields: [
                        "degree",
                        "institution",
                        "graduationYear",
                        "gpa"
                    ]
                }
            }
        }
    }
};

export default roles;