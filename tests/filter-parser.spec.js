import chai from 'chai';

const { expect } = chai;

describe('Filter Parser', () => {
    describe('parseFilterInput', () => {
        let parseFilterInput;

        before(() => {
            parseFilterInput = epicenter.utils.parseFilterInput;
        });

        it('should return undefined for falsy inputs', () => {
            expect(parseFilterInput(undefined)).to.be.undefined;
            expect(parseFilterInput(null)).to.be.undefined;
            expect(parseFilterInput('')).to.be.undefined;
        });

        it('should handle empty string arrays', () => {
            expect(parseFilterInput([])).to.be.undefined;
        });

        describe('string array input (backwards compatibility)', () => {
            it('should join single filter with semicolon', () => {
                expect(parseFilterInput(['run.hidden=false'])).to.equal('run.hidden=false');
            });

            it('should join multiple filters with semicolon', () => {
                expect(parseFilterInput(['var.score>=24', 'run.hidden=false', 'var.certified*=true']))
                    .to.equal('var.score>=24;run.hidden=false;var.certified*=true');
            });

            it('should handle complex filter expressions', () => {
                expect(parseFilterInput([
                    'var.foo|=1|2|3',
                    'var.score>=24',
                    'var.certified*=true',
                    'run.hidden=false',
                    'meta.classification~=bar-*',
                ])).to.equal('var.foo|=1|2|3;var.score>=24;var.certified*=true;run.hidden=false;meta.classification~=bar-*');
            });
        });

        describe('string input (raw boolean filter)', () => {
            it('should pass through simple filter strings', () => {
                expect(parseFilterInput('var.score>=24;meta.classification~=bar-*')).to.equal('var.score>=24;meta.classification~=bar-*');
            });

            it('should pass through complex boolean filter strings', () => {
                const complexFilter = '(var.score>=24;run.hidden=false;[var.foo|=1|2|3])';
                expect(parseFilterInput(complexFilter)).to.equal(complexFilter);
            });

            it('should pass through taxonomy filters', () => {
                const taxonomyFilter = '{meta.classification~=bar-*;[meta.categorization~=*-baz]}';
                expect(parseFilterInput(taxonomyFilter)).to.equal(taxonomyFilter);
            });
        });

        describe('FilterGroup object input', () => {
            describe('AND groups', () => {
                it('should create AND group with multiple filters', () => {
                    const filterGroup = {
                        type: 'and',
                        filters: ['var.score>=24', 'var.certified*=true'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('(var.score>=24;var.certified*=true)');
                });

                it('should handle single filter without grouping', () => {
                    const filterGroup = {
                        type: 'and',
                        filters: ['var.certified*=true'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('var.certified*=true');
                });

                it('should handle empty filters', () => {
                    const filterGroup = {
                        type: 'and',
                        filters: [],
                    };
                    expect(parseFilterInput(filterGroup)).to.be.undefined;
                });
            });

            describe('OR groups', () => {
                it('should create OR group with multiple filters', () => {
                    const filterGroup = {
                        type: 'or',
                        filters: ['var.foo|=1|2|3'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('var.foo|=1|2|3');
                });

                it('should handle single filter without grouping', () => {
                    const filterGroup = {
                        type: 'or',
                        filters: ['meta.classification~=bar-*'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('meta.classification~=bar-*');
                });
            });

            describe('Taxonomy groups', () => {
                it('should create taxonomy group with multiple filters', () => {
                    const filterGroup = {
                        type: 'taxonomy',
                        filters: ['meta.classification~=bar-*', 'meta.categorization~=*-baz'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('{meta.classification~=bar-*;meta.categorization~=*-baz}');
                });

                it('should handle single taxonomy filter without grouping', () => {
                    const filterGroup = {
                        type: 'taxonomy',
                        filters: ['run.hidden=false'],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('run.hidden=false');
                });
            });

            describe('Nested groups', () => {
                it('should handle nested AND/OR groups', () => {
                    const filterGroup = {
                        type: 'and',
                        filters: [
                            'var.score>=24',
                            'run.hidden=false',
                            {
                                type: 'or',
                                filters: ['var.foo|=1|2|3'],
                            },
                        ],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('(var.score>=24;run.hidden=false;var.foo|=1|2|3)');
                });

                it('should handle deeply nested groups', () => {
                    const filterGroup = {
                        type: 'or',
                        filters: [
                            {
                                type: 'and',
                                filters: [
                                    'meta.classification~=bar-*',
                                    {
                                        type: 'or',
                                        filters: ['var.foo|=1|2|3'],
                                    },
                                ],
                            },
                            'var.certified*=true',
                        ],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('[(meta.classification~=bar-*;var.foo|=1|2|3);var.certified*=true]');
                });

                it('should handle taxonomy groups with nested logic', () => {
                    const filterGroup = {
                        type: 'taxonomy',
                        filters: [
                            'run.hidden=false',
                            {
                                type: 'and',
                                filters: [
                                    'var.score>=24',
                                    {
                                        type: 'or',
                                        filters: ['meta.classification~=bar-*', 'meta.categorization~=*-baz'],
                                    },
                                ],
                            },
                        ],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('{run.hidden=false;(var.score>=24;[meta.classification~=bar-*;meta.categorization~=*-baz])}');
                });

                it('should handle complex example from documentation', () => {
                    // (var.score>=24;run.hidden=false;var.foo|=1|2|3) is var.score>=24 and run.hidden=false and var.foo has values 1, 2, or 3
                    const filterGroup = {
                        type: 'and',
                        filters: [
                            'var.score>=24',
                            'run.hidden=false',
                            'var.foo|=1|2|3',
                        ],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('(var.score>=24;run.hidden=false;var.foo|=1|2|3)');
                });
            });

            describe('Error handling', () => {
                it('should throw error for invalid group type', () => {
                    const invalidGroup = {
                        type: 'invalid',
                        filters: ['name=Mike'],
                    };
                    expect(() => parseFilterInput(invalidGroup)).to.throw('Invalid or missing filter group type: invalid');
                });

                it('should throw error for missing type', () => {
                    const groupWithoutType = {
                        filters: ['meta.classification~=bar-*', 'meta.categorization~=*-baz'],
                    };
                    expect(() => parseFilterInput(groupWithoutType)).to.throw('Invalid or missing filter group type: undefined');
                });

                it('should throw error for undefined type', () => {
                    const groupWithUndefinedType = {
                        type: undefined,
                        filters: ['var.certified*=true', 'run.hidden=false'],
                    };
                    expect(() => parseFilterInput(groupWithUndefinedType)).to.throw('Invalid or missing filter group type: undefined');
                });

                it('should throw error for single filter with missing type', () => {
                    const groupWithoutType = {
                        filters: ['var.certified*=true'],
                    };
                    expect(() => parseFilterInput(groupWithoutType)).to.throw('Invalid or missing filter group type: undefined');
                });

                it('should filter out empty nested groups', () => {
                    const filterGroup = {
                        type: 'and',
                        filters: [
                            'var.score>=24',
                            {
                                type: 'or',
                                filters: [],
                            },
                            'var.certified*=true',
                        ],
                    };
                    expect(parseFilterInput(filterGroup)).to.equal('(var.score>=24;var.certified*=true)');
                });
            });
        });

        describe('Real-world examples', () => {
            it('should handle run query example', () => {
                const filters = [
                    'var.foo|=1|2|3',               // look for runs with a variable 'foo' with the values 1, 2, or 3
                    'var.score>=24',                // looks for runs with a variable 'score' higher than or equal to 24
                    'var.certified*=true',          // looks for runs where the variable 'certified' exists,
                    'run.hidden=false',             // where the run's 'hidden' attribute is false
                    'meta.classification~=bar-*',   // where the run metadata contains a 'classification' that begins with 'bar-',
                    'meta.categorization~=*-baz',    // where the run metadata contains a 'categorization' that does not end with '-baz',
                ];
                expect(parseFilterInput(filters)).to.equal(
                    'var.foo|=1|2|3;var.score>=24;var.certified*=true;run.hidden=false;meta.classification~=bar-*;meta.categorization~=*-baz'
                );
            });

            it('should handle complex filter example', () => {
                const filterGroup = {
                    type: 'or',
                    filters: [
                        {
                            type: 'and',
                            filters: [
                                'var.score>=24',
                                'run.hidden=false',
                                {
                                    type: 'or',
                                    filters: ['meta.classification~=bar-*', 'meta.categorization~=*-baz'],
                                },
                            ],
                        },
                        {
                            type: 'and',
                            filters: [
                                'var.certified*=true',
                                'var.foo|=1|2|3',
                            ],
                        },
                    ],
                };
                expect(parseFilterInput(filterGroup)).to.equal(
                    '[(var.score>=24;run.hidden=false;[meta.classification~=bar-*;meta.categorization~=*-baz]);(var.certified*=true;var.foo|=1|2|3)]'
                );
            });
        });
    });
});