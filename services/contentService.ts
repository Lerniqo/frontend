// Content service for handling syllabus and educational content

// Types for syllabus structure
export interface Particle {
  id: string;
  name: string;
}

export interface Atom {
  id: string;
  name: string;
  layer: "Atom";
  particles: Particle[];
}

export interface Molecule {
  id: string;
  name: string;
  layer: "Molecule";
  children: Atom[];
}

export interface Matter {
  id: string;
  name: string;
  layer: "Matter";
  children: Molecule[];
}

export interface Subject {
  id: string;
  name: string;
  layer: "Subject";
  children: Matter[];
}

export interface SyllabusResponse {
  hierarchy: Subject;
}

/**
 * Retrieves the entire syllabus structure
 * @returns Promise<SyllabusResponse> - The syllabus hierarchy
 */
export async function retrieveSyllabuses(): Promise<SyllabusResponse> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/content/syllabus');
    // const data = await response.json();
    // return data;

    // Mock data for now
    const mockSyllabusData: SyllabusResponse = {
      hierarchy: {
        id: "OLM001",
        name: "Ordinary Level Mathematics",
        layer: "Subject",
        children: [
          {
            id: "MAT001",
            name: "Numbers",
            layer: "Matter",
            children: [
              {
                id: "MOL001",
                name: "Fractions",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM001",
                    name: "Multiplication of Fractions",
                    layer: "Atom",
                    particles: [
                      { id: "PAR001", name: "fraction-multiplication" },
                      { id: "PAR002", name: "of-means-multiply" },
                    ],
                  },
                  {
                    id: "ATM002",
                    name: "Division of Fractions",
                    layer: "Atom",
                    particles: [
                      { id: "PAR003", name: "fraction-division" },
                      { id: "PAR004", name: "reciprocal" },
                    ],
                  },
                  {
                    id: "ATM003",
                    name: "Comparing Fractions",
                    layer: "Atom",
                    particles: [{ id: "PAR005", name: "comparing-fractions" }],
                  },
                  {
                    id: "ATM004",
                    name: "Simplifying Fractions",
                    layer: "Atom",
                    particles: [{ id: "PAR006", name: "reduce-fraction" }],
                  },
                  {
                    id: "ATM005",
                    name: "Fraction Conversions",
                    layer: "Atom",
                    particles: [
                      {
                        id: "PAR007",
                        name: "equivalent-fractions-decimals-percents",
                      },
                      { id: "PAR008", name: "fraction-decimals-percents" },
                    ],
                  },
                  {
                    id: "ATM006",
                    name: "General Fractions",
                    layer: "Atom",
                    particles: [{ id: "PAR009", name: "fractions" }],
                  },
                ],
              },
              {
                id: "MOL002",
                name: "Percentages",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM007",
                    name: "Calculating Percentages",
                    layer: "Atom",
                    particles: [
                      { id: "PAR010", name: "finding-percents" },
                      { id: "PAR011", name: "percent-of" },
                      {
                        id: "PAR012",
                        name: "application: finding percentage of a number",
                      },
                      { id: "PAR013", name: "percents" },
                    ],
                  },
                  {
                    id: "ATM008",
                    name: "Discounts",
                    layer: "Atom",
                    particles: [{ id: "PAR014", name: "discount" }],
                  },
                ],
              },
              {
                id: "MOL003",
                name: "Decimals",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM009",
                    name: "Multiplying Decimals",
                    layer: "Atom",
                    particles: [{ id: "PAR015", name: "multiplying-decimals" }],
                  },
                  {
                    id: "ATM010",
                    name: "Adding and Subtracting Decimals",
                    layer: "Atom",
                    particles: [
                      { id: "PAR016", name: "adding-decimals" },
                      { id: "PAR017", name: "subtracting-decimals" },
                    ],
                  },
                  {
                    id: "ATM011",
                    name: "Dividing Decimals",
                    layer: "Atom",
                    particles: [{ id: "PAR018", name: "divide-decimals" }],
                  },
                ],
              },
              {
                id: "MOL004",
                name: "Whole Numbers",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM012",
                    name: "Basic Operations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR019", name: "addition" },
                      {
                        id: "PAR020",
                        name: "application: multi-column addition",
                      },
                      { id: "PAR021", name: "subtraction" },
                      {
                        id: "PAR022",
                        name: "application: multi-column subtraction",
                      },
                      { id: "PAR023", name: "multiplication" },
                      {
                        id: "PAR024",
                        name: "application: simple multiplication",
                      },
                      { id: "PAR025", name: "division" },
                    ],
                  },
                  {
                    id: "ATM013",
                    name: "Order of Operations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR026", name: "order-of-operations" },
                      {
                        id: "PAR027",
                        name: "application: order of operations",
                      },
                    ],
                  },
                ],
              },
              {
                id: "MOL005",
                name: "Indices",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM014",
                    name: "Exponents",
                    layer: "Atom",
                    particles: [
                      { id: "PAR028", name: "exponents" },
                      { id: "PAR029", name: "scientific-notation" },
                    ],
                  },
                  {
                    id: "ATM015",
                    name: "Square Roots",
                    layer: "Atom",
                    particles: [{ id: "PAR030", name: "square-root" }],
                  },
                ],
              },
              {
                id: "MOL006",
                name: "Number Patterns",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM016",
                    name: "Identifying Patterns",
                    layer: "Atom",
                    particles: [
                      { id: "PAR031", name: "pattern-finding" },
                      { id: "PAR032", name: "p-patterns-relations-algebra" },
                    ],
                  },
                ],
              },
              {
                id: "MOL007",
                name: "Integers",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM017",
                    name: "Operations with Integers",
                    layer: "Atom",
                    particles: [
                      { id: "PAR033", name: "integers" },
                      {
                        id: "PAR034",
                        name: "multiplying-positive-negative-numbers",
                      },
                    ],
                  },
                ],
              },
              {
                id: "MOL008",
                name: "Real Numbers",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM018",
                    name: "Number Line Operations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR035", name: "number-line" },
                      { id: "PAR036", name: "interpreting-numberline" },
                      { id: "PAR037", name: "ordering-numbers" },
                    ],
                  },
                ],
              },
              {
                id: "MOL009",
                name: "Ratio and Proportion",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM019",
                    name: "Proportions",
                    layer: "Atom",
                    particles: [{ id: "PAR038", name: "proportion" }],
                  },
                  {
                    id: "ATM020",
                    name: "Divisibility",
                    layer: "Atom",
                    particles: [
                      { id: "PAR039", name: "divisibility" },
                      { id: "PAR040", name: "prime-number" },
                      { id: "PAR041", name: "least-common-multiple" },
                    ],
                  },
                ],
              },
              {
                id: "MOL010",
                name: "Number Sense",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM021",
                    name: "General Calculations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR042", name: "simple-calculation" },
                      { id: "PAR043", name: "n-number-sense-operations" },
                      { id: "PAR044", name: "rounding" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "MAT002",
            name: "Measurements",
            layer: "Matter",
            children: [
              {
                id: "MOL011",
                name: "Area of Plane Figures",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM022",
                    name: "Area Calculations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR045", name: "area" },
                      { id: "PAR046", name: "area-concept" },
                      { id: "PAR047", name: "area-of-circle" },
                      { id: "PAR048", name: "meaning-of-pi" },
                    ],
                  },
                ],
              },
              {
                id: "MOL012",
                name: "Perimeter",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM023",
                    name: "Perimeter and Circumference",
                    layer: "Atom",
                    particles: [
                      { id: "PAR049", name: "perimeter" },
                      { id: "PAR050", name: "circumference" },
                      { id: "PAR051", name: "meaning-of-pi" },
                    ],
                  },
                ],
              },
              {
                id: "MOL013",
                name: "Rate",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM024",
                    name: "Rate Calculations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR052", name: "rate" },
                      { id: "PAR053", name: "rate-with-distance-and-time" },
                    ],
                  },
                ],
              },
              {
                id: "MOL014",
                name: "Unit Conversion",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM025",
                    name: "Converting Units",
                    layer: "Atom",
                    particles: [
                      { id: "PAR054", name: "unit-conversion" },
                      { id: "PAR055", name: "linear-area-volume-conversion" },
                    ],
                  },
                ],
              },
              {
                id: "MOL015",
                name: "General Measurements",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM026",
                    name: "Measurement Techniques",
                    layer: "Atom",
                    particles: [
                      { id: "PAR056", name: "measurement" },
                      { id: "PAR057", name: "m-measurement" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "MAT003",
            name: "Algebra",
            layer: "Matter",
            children: [
              {
                id: "MOL016",
                name: "Linear Equations",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM027",
                    name: "Solving Equations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR058", name: "equation-solving" },
                      { id: "PAR059", name: "interpreting-linear-equations" },
                      { id: "PAR060", name: "equation-concept" },
                    ],
                  },
                  {
                    id: "ATM028",
                    name: "Solving Inequalities",
                    layer: "Atom",
                    particles: [
                      { id: "PAR061", name: "inequality-solving" },
                      { id: "PAR062", name: "inequalities" },
                    ],
                  },
                ],
              },
              {
                id: "MOL017",
                name: "Algebraic Expressions",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM029",
                    name: "Manipulating Expressions",
                    layer: "Atom",
                    particles: [
                      { id: "PAR063", name: "algebraic-manipulation" },
                      { id: "PAR064", name: "symbolization-articulation" },
                      { id: "PAR065", name: "algebra symbolization" },
                      {
                        id: "PAR066",
                        name: "application: compare expressions",
                      },
                      {
                        id: "PAR067",
                        name: "making-sense-of-expressions-and-equations",
                      },
                    ],
                  },
                  {
                    id: "ATM030",
                    name: "Substitution in Expressions",
                    layer: "Atom",
                    particles: [{ id: "PAR068", name: "substitution" }],
                  },
                ],
              },
              {
                id: "MOL018",
                name: "Graphs",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM031",
                    name: "Graph Plotting and Interpretation",
                    layer: "Atom",
                    particles: [
                      { id: "PAR069", name: "point-plotting" },
                      { id: "PAR070", name: "reading-graph" },
                      { id: "PAR071", name: "application: read points" },
                      { id: "PAR072", name: "application: compare points" },
                      { id: "PAR073", name: "graph interpretation" },
                      { id: "PAR074", name: "graph-shape" },
                    ],
                  },
                  {
                    id: "ATM032",
                    name: "Slope of Lines",
                    layer: "Atom",
                    particles: [
                      { id: "PAR075", name: "slope" },
                      {
                        id: "PAR076",
                        name: "application: find slope in graph",
                      },
                    ],
                  },
                ],
              },
              {
                id: "MOL019",
                name: "Functions",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM033",
                    name: "Evaluating Functions",
                    layer: "Atom",
                    particles: [
                      { id: "PAR077", name: "evaluating-functions" },
                      { id: "PAR078", name: "inducing-functions" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "MAT004",
            name: "Geometry",
            layer: "Matter",
            children: [
              {
                id: "MOL020",
                name: "Geometric Shapes and Solids",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM034",
                    name: "Properties of Shapes",
                    layer: "Atom",
                    particles: [
                      { id: "PAR079", name: "properties-of-geometric-figures" },
                      { id: "PAR080", name: "properties-of-solids" },
                      { id: "PAR081", name: "g-geometry" },
                    ],
                  },
                  {
                    id: "ATM035",
                    name: "Surface Area and Volume",
                    layer: "Atom",
                    particles: [
                      { id: "PAR082", name: "surface-area-and-volume" },
                    ],
                  },
                ],
              },
              {
                id: "MOL021",
                name: "Triangle Theorems",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM036",
                    name: "Sum of Interior Angles",
                    layer: "Atom",
                    particles: [
                      { id: "PAR083", name: "sum-of-interior-angles-triangle" },
                      {
                        id: "PAR084",
                        name: "sum-of-interior-angles-more-than-3-sides",
                      },
                    ],
                  },
                  {
                    id: "ATM037",
                    name: "Isosceles Triangle Properties",
                    layer: "Atom",
                    particles: [
                      { id: "PAR085", name: "isosceles-triangle" },
                      { id: "PAR086", name: "application: isosceles triangle" },
                    ],
                  },
                  {
                    id: "ATM038",
                    name: "Triangle Inequality",
                    layer: "Atom",
                    particles: [{ id: "PAR087", name: "triangle-inequality" }],
                  },
                ],
              },
              {
                id: "MOL022",
                name: "Pythagoras' Theorem",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM039",
                    name: "Applying Pythagoras' Theorem",
                    layer: "Atom",
                    particles: [{ id: "PAR088", name: "pythagorean-theorem" }],
                  },
                ],
              },
              {
                id: "MOL023",
                name: "Angles and Parallel Lines",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM040",
                    name: "Supplementary Angles",
                    layer: "Atom",
                    particles: [{ id: "PAR089", name: "supplementary-angles" }],
                  },
                  {
                    id: "ATM041",
                    name: "Transversals",
                    layer: "Atom",
                    particles: [{ id: "PAR090", name: "transversals" }],
                  },
                ],
              },
              {
                id: "MOL024",
                name: "Congruence and Similarity",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM042",
                    name: "Congruence",
                    layer: "Atom",
                    particles: [{ id: "PAR091", name: "congruence" }],
                  },
                  {
                    id: "ATM043",
                    name: "Similar Triangles",
                    layer: "Atom",
                    particles: [{ id: "PAR092", name: "similar-triangles" }],
                  },
                ],
              },
              {
                id: "MOL025",
                name: "Transformations",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM044",
                    name: "Rotations",
                    layer: "Atom",
                    particles: [
                      { id: "PAR093", name: "transformations-rotations" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "MAT005",
            name: "Sets and Probability",
            layer: "Matter",
            children: [
              {
                id: "MOL026",
                name: "Sets",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM045",
                    name: "Venn Diagrams",
                    layer: "Atom",
                    particles: [{ id: "PAR094", name: "venn-diagram" }],
                  },
                ],
              },
              {
                id: "MOL027",
                name: "Probability",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM046",
                    name: "Probability Calculations",
                    layer: "Atom",
                    particles: [{ id: "PAR095", name: "probability" }],
                  },
                  {
                    id: "ATM047",
                    name: "Combinatorics",
                    layer: "Atom",
                    particles: [{ id: "PAR096", name: "combinatorics" }],
                  },
                ],
              },
            ],
          },
          {
            id: "MAT006",
            name: "Statistics",
            layer: "Matter",
            children: [
              {
                id: "MOL028",
                name: "Measures of Central Tendency",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM048",
                    name: "Mean",
                    layer: "Atom",
                    particles: [{ id: "PAR097", name: "mean" }],
                  },
                  {
                    id: "ATM049",
                    name: "Median",
                    layer: "Atom",
                    particles: [{ id: "PAR098", name: "median" }],
                  },
                  {
                    id: "ATM050",
                    name: "Mode",
                    layer: "Atom",
                    particles: [{ id: "PAR099", name: "mode" }],
                  },
                ],
              },
              {
                id: "MOL029",
                name: "Data Representation",
                layer: "Molecule",
                children: [
                  {
                    id: "ATM051",
                    name: "Circle Graphs",
                    layer: "Atom",
                    particles: [{ id: "PAR100", name: "circle-graph" }],
                  },
                  {
                    id: "ATM052",
                    name: "Stem and Leaf Plots",
                    layer: "Atom",
                    particles: [{ id: "PAR101", name: "stem-and-leaf-plot" }],
                  },
                  {
                    id: "ATM053",
                    name: "General Statistics",
                    layer: "Atom",
                    particles: [{ id: "PAR102", name: "statistics" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return mockSyllabusData;
  } catch (error) {
    console.error("Error retrieving syllabuses:", error);
    throw new Error("Failed to retrieve syllabuses");
  }
}

// Helper function to find a specific node by ID
export function findNodeById(
  hierarchy: Subject | Matter | Molecule | Atom,
  id: string
): Subject | Matter | Molecule | Atom | null {
  if (hierarchy.id === id) {
    return hierarchy;
  }

  if ("children" in hierarchy && hierarchy.children) {
    for (const child of hierarchy.children) {
      const found = findNodeById(child, id);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

// Helper function to get all particles from a specific atom
export function getParticlesFromAtom(
  atomId: string,
  syllabusData: SyllabusResponse
): Particle[] {
  const atom = findNodeById(syllabusData.hierarchy, atomId) as Atom;
  return atom?.particles || [];
}
