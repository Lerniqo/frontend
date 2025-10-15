// Content service for handling syllabus and educational content
import apiClient from "@/services/apiClient";

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

// Types for concept structure
export interface ConceptPrerequisite {
  conceptId: string;
  name: string;
}

export interface ConceptResource {
  resourceId: string;
  title: string;
  type: "Video" | "Note" | "Quiz";
  url: string;
}

export interface ConceptResponse {
  conceptId: string;
  name: string;
  prerequisites: ConceptPrerequisite[];
  resources: ConceptResource[];
}

/**
 * Retrieves a specific concept by ID with its prerequisites and resources
 * @param conceptId - The ID of the concept to retrieve
 * @returns Promise<ConceptResponse> - The concept details with prerequisites and resources
 */
export async function getConceptById(
  conceptId: string
): Promise<ConceptResponse> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch(`/api/content/concepts/${conceptId}`);
    // const data = await response.json();
    // return data;

    // Mock data for different concepts
    const mockConceptsData: Record<string, ConceptResponse> = {
      "pythagorean-theorem": {
        conceptId: "pythagorean-theorem",
        name: "Pythagorean Theorem",
        prerequisites: [
          { conceptId: "square-root", name: "Square Roots" },
          { conceptId: "right-triangles", name: "Right Triangles" },
          { conceptId: "basic-algebra", name: "Basic Algebra" },
        ],
        resources: [
          {
            resourceId: "video-pythagoras-intro",
            title: "Introduction to Pythagorean Theorem",
            type: "Video",
            url: "https://www.youtube.com/watch?v=pythagorean-intro",
          },
          {
            resourceId: "exercise-pythagoras-basic",
            title: "Basic Pythagorean Theorem Problems",
            type: "Quiz",
            url: "/exercises/pythagorean-basic",
          },
          {
            resourceId: "article-pythagoras-history",
            title: "History and Applications of Pythagorean Theorem",
            type: "Note",
            url: "/articles/pythagorean-history",
          },
          {
            resourceId: "quiz-pythagoras-assessment",
            title: "Pythagorean Theorem Quiz",
            type: "Quiz",
            url: "/quizzes/pythagorean-assessment",
          },
        ],
      },
      "fraction-multiplication": {
        conceptId: "fraction-multiplication",
        name: "Multiplication of Fractions",
        prerequisites: [
          { conceptId: "basic-fractions", name: "Basic Fractions" },
          { conceptId: "multiplication", name: "Basic Multiplication" },
        ],
        resources: [
          {
            resourceId: "video-fraction-mult-intro",
            title: "How to Multiply Fractions",
            type: "Video",
            url: "https://www.youtube.com/watch?v=fraction-multiplication",
          },
          {
            resourceId: "exercise-fraction-mult-practice",
            title: "Fraction Multiplication Practice",
            type: "Quiz",
            url: "/exercises/fraction-multiplication-practice",
          },
          {
            resourceId: "document-fraction-mult-guide",
            title: "Step-by-Step Guide to Fraction Multiplication",
            type: "Note",
            url: "/documents/fraction-multiplication-guide.pdf",
          },
        ],
      },
      "linear-equations": {
        conceptId: "linear-equations",
        name: "Linear Equations",
        prerequisites: [
          { conceptId: "algebraic-expressions", name: "Algebraic Expressions" },
          { conceptId: "basic-operations", name: "Basic Operations" },
          { conceptId: "integers", name: "Working with Integers" },
        ],
        resources: [
          {
            resourceId: "video-linear-eq-solving",
            title: "Solving Linear Equations",
            type: "Video",
            url: "https://www.youtube.com/watch?v=Tj5OkhsTjvg",
          },
          {
            resourceId: "exercise-linear-eq-practice",
            title: "Linear Equation Practice Problems",
            type: "Quiz",
            url: "/exercises/linear-equations-practice",
          },
          {
            resourceId: "article-linear-eq-applications",
            title: "Real-World Applications of Linear Equations",
            type: "Note",
            url: "https://topicpdfs.s3.eu-north-1.amazonaws.com/Grade%2010/grade-10-mathematics-Algebraic-Fractions.pdf",
          },
          {
            resourceId: "quiz-linear-eq-test",
            title: "Linear Equations Mastery Test",
            type: "Quiz",
            url: "/quizzes/linear-equations-test",
          },
        ],
      },
      "area-calculations": {
        conceptId: "area-calculations",
        name: "Area Calculations",
        prerequisites: [
          { conceptId: "basic-multiplication", name: "Basic Multiplication" },
          { conceptId: "geometric-shapes", name: "Basic Geometric Shapes" },
          { conceptId: "pi-concept", name: "Understanding Pi" },
        ],
        resources: [
          {
            resourceId: "video-area-formulas",
            title: "Area Formulas for Different Shapes",
            type: "Video",
            url: "https://www.youtube.com/watch?v=Tj5OkhsTjvg",
          },
          {
            resourceId: "exercise-area-practice",
            title: "Area Calculation Practice",
            type: "Quiz",
            url: "/exercises/area-calculations-practice",
          },
          {
            resourceId: "document-area-reference",
            title: "Quick Reference: Area Formulas",
            type: "Note",
            url: "/documents/area-formulas-reference.pdf",
          },
        ],
      },
    };

    const conceptId = "linear-equations";

    // Check if the concept exists in our mock data
    const conceptData = mockConceptsData[conceptId];
    if (!conceptData) {
      throw new Error(`Concept with ID '${conceptId}' not found`);
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return conceptData;
  } catch (error) {
    console.error(`Error retrieving concept ${conceptId}:`, error);
    throw new Error(`Failed to retrieve concept: ${conceptId}`);
  }
}

// Types for whole syllabus structure with two different hierarchies
export interface WholeSyllabusNode {
  conceptId: string;
  name: string;
  type: string;
  description: string;
  children?: WholeSyllabusNode[];
  createdAt: string;
}

export interface WholeSyllabusResponse {
  syllabusByMatter: WholeSyllabusNode[];
  syllabusByGrade: WholeSyllabusNode[];
  totalConcepts: number;
  retrievedAt: string;
}

/**
 * Retrieves the whole syllabus structure with both Matter and Grade hierarchies
 * @returns Promise<WholeSyllabusResponse> - The complete syllabus with both hierarchies
 */
export async function retrieveWholeSyllabuses(): Promise<WholeSyllabusResponse> {
  try {
    const response = await apiClient.get("/content-service/syllabus");
    const data = response.data;

    if (
      !data.syllabus ||
      !Array.isArray(data.syllabus) ||
      data.syllabus.length === 0
    ) {
      console.warn("⚠️ Invalid syllabus data structure received:", data);
      // Return empty structure instead of throwing
      return {
        syllabusByMatter: [],
        syllabusByGrade: [],
        totalConcepts: 0,
        retrievedAt: new Date().toISOString(),
      };
    }

    // Get the main subject node (should be the first and only item in the array)
    const mainSubject = data.syllabus[0];

    if (
      !mainSubject ||
      !mainSubject.children ||
      !Array.isArray(mainSubject.children)
    ) {
      console.warn(
        "⚠️ No children found in syllabus structure. MainSubject:",
        mainSubject
      );
      // Return empty structure instead of throwing
      return {
        syllabusByMatter: [],
        syllabusByGrade: [],
        totalConcepts: 0,
        retrievedAt: new Date().toISOString(),
      };
    }

    // Separate the children by type
    const syllabusByMatter: WholeSyllabusNode[] = [];
    const syllabusByGrade: WholeSyllabusNode[] = [];

    mainSubject.children.forEach((child: WholeSyllabusNode) => {
      if (child.type === "Matter") {
        syllabusByMatter.push(child);
      } else if (child.type === "Grade") {
        syllabusByGrade.push(child);
      }
    });

    return {
      syllabusByMatter,
      syllabusByGrade,
      totalConcepts: data.totalConcepts || 0,
      retrievedAt: data.retrievedAt || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Error retrieving whole syllabuses:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw new Error(
      `Failed to retrieve whole syllabuses: ${
        error.response?.data?.message || error.message
      }`
    );
  }
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

// Types for quiz structure
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Hard";
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface QuizResponse {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

/**
 * Retrieves a specific quiz by ID with its questions, options, and answers
 * @param quizId - The ID of the quiz to retrieve
 * @returns Promise<QuizResponse> - The quiz details with questions and options
 */
export async function getQuizzById(quizId: string): Promise<QuizResponse> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch(`/api/content/quizzes/${quizId}`);
    // const data = await response.json();
    // return data;

    // Mock data - return same quiz for any quizId for now
    const mockQuizData: QuizResponse = {
      id: quizId, // Use the provided quizId
      title: "Mathematics Practice Quiz",
      questions: [
        {
          id: "question-001",
          text: "In a right-angled triangle, what is the side opposite the right angle called?",
          difficulty: "Easy",
          options: [
            { id: "option-001a", text: "Adjacent" },
            { id: "option-001b", text: "Opposite" },
            { id: "option-001c", text: "Hypotenuse" },
            { id: "option-001d", text: "Tangent" },
          ],
          correctOptionId: "option-001c",
          explanation:
            "The hypotenuse is always the longest side in a right-angled triangle and is located opposite the right angle.",
        },
        {
          id: "question-002",
          text: "If the two shorter sides of a right-angled triangle measure 6cm and 8cm, what is the length of the hypotenuse?",
          difficulty: "Medium",
          options: [
            { id: "option-002a", text: "14cm" },
            { id: "option-002b", text: "10cm" },
            { id: "option-002c", text: "48cm" },
            { id: "option-002d", text: "100cm" },
          ],
          correctOptionId: "option-002b",
          explanation:
            "According to Pythagoras' theorem, a² + b² = c². So, 6² + 8² = 36 + 64 = 100. The square root of 100 is 10. Therefore, the hypotenuse is 10cm.",
        },
        {
          id: "question-003",
          text: "Which of the following is the correct formula for the Pythagorean theorem?",
          difficulty: "Easy",
          options: [
            { id: "option-003a", text: "a + b = c" },
            { id: "option-003b", text: "a² + b² = c²" },
            { id: "option-003c", text: "a × b = c" },
            { id: "option-003d", text: "a² - b² = c²" },
          ],
          correctOptionId: "option-003b",
          explanation:
            "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse (c) equals the sum of squares of the other two sides: a² + b² = c².",
        },
        {
          id: "question-004",
          text: "What is 2/3 × 3/4?",
          difficulty: "Medium",
          options: [
            { id: "option-004a", text: "5/7" },
            { id: "option-004b", text: "6/12" },
            { id: "option-004c", text: "1/2" },
            { id: "option-004d", text: "2/4" },
          ],
          correctOptionId: "option-004c",
          explanation:
            "To multiply fractions, multiply the numerators together and denominators together: (2×3)/(3×4) = 6/12 = 1/2.",
        },
        {
          id: "question-005",
          text: "Solve for x: 2x + 5 = 13",
          difficulty: "Medium",
          options: [
            { id: "option-005a", text: "x = 4" },
            { id: "option-005b", text: "x = 6" },
            { id: "option-005c", text: "x = 8" },
            { id: "option-005d", text: "x = 9" },
          ],
          correctOptionId: "option-005a",
          explanation:
            "Subtract 5 from both sides: 2x = 8. Then divide both sides by 2: x = 4.",
        },
      ],
    };

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockQuizData;
  } catch (error) {
    console.error(`Error retrieving quiz ${quizId}:`, error);
    throw new Error(`Failed to retrieve quiz: ${quizId}`);
  }
}

// Helper function to get all particles from a specific atom
export function getParticlesFromAtom(
  atomId: string,
  syllabusData: SyllabusResponse
): Particle[] {
  const atom = findNodeById(syllabusData.hierarchy, atomId) as Atom;
  return atom?.particles || [];
}

// Types for learning path structure
export interface LearningPathConcept {
  conceptName: string;
  conceptId: string;
  status: "done" | "progressing" | "waiting";
}

/**
 * Retrieves the learning path for a student
 * @returns Promise<LearningPathConcept[]> - Array of concepts in the learning path
 */
export async function getLearningPath(): Promise<LearningPathConcept[]> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/learning-path');
    // const data = await response.json();
    // return data;

    // Mock data for testing purposes
    const mockLearningPath: LearningPathConcept[] = [
      {
        conceptName: "Linear Equations",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000001",
        status: "done",
      },
      {
        conceptName: "Quadratic Equations",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000002",
        status: "done",
      },
      {
        conceptName: "Factorization",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000003",
        status: "done",
      },
      {
        conceptName: "Pythagorean Theorem",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000004",
        status: "progressing",
      },
      {
        conceptName: "Trigonometric Ratios",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000005",
        status: "waiting",
      },
      {
        conceptName: "Geometry — Circles",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000006",
        status: "waiting",
      },
      {
        conceptName: "Coordinate Geometry",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000007",
        status: "waiting",
      },
      {
        conceptName: "Probability",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000008",
        status: "waiting",
      },
      {
        conceptName: "Statistics (Mean, Median, Mode)",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000009",
        status: "waiting",
      },
      {
        conceptName: "Inequalities",
        conceptId: "c1d4f9a0-1a2b-4c3d-8e5f-000000000010",
        status: "waiting",
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockLearningPath;
  } catch (error) {
    console.error("Error retrieving learning path:", error);
    throw new Error("Failed to retrieve learning path");
  }
}

// Types for initial quiz structure
export interface InitialQuizQuestion {
  questionId: number;
  question: string;
  choices: string[];
  answer: string;
  isCorrect?: boolean;
}

/**
 * Retrieves the initial quiz questions for generating a learning path
 * @returns Promise<InitialQuizQuestion[]> - Array of quiz questions
 */
export async function getInitialQuizz(): Promise<InitialQuizQuestion[]> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/quiz/initial');
    // const data = await response.json();
    // return data;

    // Mock data for testing purposes
    const mockInitialQuiz: InitialQuizQuestion[] = [
      {
        questionId: 1,
        question: "What is the value of x if 2x + 5 = 13?",
        choices: ["3", "4", "5", "6"],
        answer: "4",
      },
      {
        questionId: 2,
        question:
          "The perimeter of a rectangle is 24 cm. If the length is 8 cm, what is the width?",
        choices: ["4 cm", "6 cm", "8 cm", "10 cm"],
        answer: "4 cm",
      },
      {
        questionId: 3,
        question: "Simplify: 3(x + 4) - 2x",
        choices: ["x + 4", "x + 12", "5x + 4", "x + 8"],
        answer: "x + 12",
      },
      {
        questionId: 4,
        question:
          "A train travels at 60 km/h. How far does it travel in 2.5 hours?",
        choices: ["120 km", "150 km", "180 km", "200 km"],
        answer: "150 km",
      },
      {
        questionId: 5,
        question: "Which of the following is a prime number?",
        choices: ["21", "29", "35", "39"],
        answer: "29",
      },
      {
        questionId: 6,
        question:
          "The ratio of boys to girls in a class is 3:4. If there are 12 boys, how many girls are there?",
        choices: ["12", "14", "16", "18"],
        answer: "16",
      },
      {
        questionId: 7,
        question: "Factorize: x^2 + 5x + 6",
        choices: [
          "(x + 2)(x + 3)",
          "(x + 1)(x + 6)",
          "(x - 2)(x - 3)",
          "(x - 1)(x - 6)",
        ],
        answer: "(x + 2)(x + 3)",
      },
      {
        questionId: 8,
        question: "What is 25% of 240?",
        choices: ["50", "60", "70", "80"],
        answer: "60",
      },
      {
        questionId: 9,
        question: "Solve for y: 3y - 7 = 11",
        choices: ["4", "5", "6", "7"],
        answer: "6",
      },
      {
        questionId: 10,
        question: "The sum of angles in a triangle is:",
        choices: ["90°", "180°", "270°", "360°"],
        answer: "180°",
      },
    ];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockInitialQuiz;
  } catch (error) {
    console.error("Error retrieving initial quiz:", error);
    throw new Error("Failed to retrieve initial quiz");
  }
}

/**
 * Sets the goal for a student
 * @param goal - The student's learning goal
 * @returns Promise<void>
 */
export async function setGoal(goal: string): Promise<void> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/student/goal', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ goal })
    // });

    console.log("Goal is setted:", goal);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
  } catch (error) {
    console.error("Error setting goal:", error);
    throw new Error("Failed to set goal");
  }
}

/**
 * Sets the initial quiz results
 * @param results - Array of quiz questions with results
 * @returns Promise<void>
 */
export async function setInitialQuizzResult(
  results: InitialQuizQuestion[]
): Promise<void> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/quiz/initial-results', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ results })
    // });

    console.log("Initial quiz results:", results);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
  } catch (error) {
    console.error("Error setting initial quiz results:", error);
    throw new Error("Failed to set initial quiz results");
  }
}

/**
 * Generates a learning path based on the initial quiz results
 * @returns Promise<void>
 */
export async function generateLearningPath(): Promise<void> {
  try {
    // TODO: Replace with actual API call when backend is implemented
    // const response = await fetch('/api/learning-path/generate', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });

    console.log("Generating learning path...");

    // Simulate network delay for path generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Learning path generated successfully");
  } catch (error) {
    console.error("Error generating learning path:", error);
    throw new Error("Failed to generate learning path");
  }
}

/**
 * Updates an existing question
 * @param questionData - The updated question data
 * @returns Promise<any>
 */
export async function updateQuestion(questionData: any): Promise<any> {
  console.warn(
    "updateQuestion function needs to be implemented - API call required"
  );
  // TODO: Implement actual API call
  // const response = await fetch(`/api/questions/${questionData.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(questionData)
  // });
  // return response.json();
  return { success: true, data: questionData };
}

/**
 * Deletes a question by ID
 * @param questionId - The ID of the question to delete
 * @returns Promise<any>
 */
export async function deleteQuestion(questionId: string): Promise<any> {
  console.warn(
    "deleteQuestion function needs to be implemented - API call required"
  );
  // TODO: Implement actual API call
  // const response = await fetch(`/api/questions/${questionId}`, {
  //   method: 'DELETE'
  // });
  // return response.json();
  return { success: true };
}

/**
 * Updates an existing resource
 * @param resourceData - The updated resource data
 * @returns Promise<any>
 */
export async function updateResource(resourceData: any): Promise<any> {
  console.warn(
    "updateResource function needs to be implemented - API call required"
  );
  // TODO: Implement actual API call
  // const response = await fetch(`/api/resources/${resourceData.id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(resourceData)
  // });
  // return response.json();
  return { success: true, data: resourceData };
}

/**
 * Deletes a resource by ID
 * @param resourceId - The ID of the resource to delete
 * @returns Promise<any>
 */
export async function deleteResource(resourceId: string): Promise<any> {
  console.warn(
    "deleteResource function needs to be implemented - API call required"
  );
  // TODO: Implement actual API call
  // const response = await fetch(`/api/resources/${resourceId}`, {
  //   method: 'DELETE'
  // });
  // return response.json();
  return { success: true };
}

// Types for concept detail structure
export interface ConceptPrerequisiteDetail {
  conceptId: string;
  name: string;
  type: string;
  description: string;
}

export interface ConceptLearningResource {
  resourceId: string;
  name: string | null;
  type: string;
  url: string;
  price: number;
}

export interface ConceptDetailResponse {
  conceptId: string;
  name: string;
  type: string;
  description: string;
  prerequisites: ConceptPrerequisiteDetail[];
  learningResources: ConceptLearningResource[];
  createdAt: any;
}

/**
 * Retrieves a specific concept by concept ID with its prerequisites and learning resources
 * @param conceptId - The ID of the concept to retrieve
 * @returns Promise<ConceptDetailResponse> - The concept details with prerequisites and resources
 */
export async function getConceptByConceptId(
  conceptId: string
): Promise<ConceptDetailResponse> {
  try {
    const response = await apiClient.get(
      `/content-service/concepts/${conceptId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error retrieving concept ${conceptId}:`, error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw new Error(
      `Failed to retrieve concept: ${
        error.response?.data?.message || error.message
      }`
    );
  }
}
