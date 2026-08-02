"use client";

import { useMemo, useState } from "react";

const publicBasePath = process.env.NEXT_PUBLIC_PAGES_BASE_PATH ?? "";

type AnatomyPreset =
  | "dentition"
  | "tooth"
  | "head"
  | "skeleton"
  | "spine"
  | "body"
  | "tissue";

type Tooth = {
  fdi: number;
  universal: number;
  name: string;
  type: string;
  roots: string;
  cusps: string;
  eruption: string;
  definition: string;
  function: string;
  recognition: string;
  pearl: string;
};

function makeTeeth(): Tooth[] {
  const sequence = [
    { arch: "Maxillary", side: "right", positions: [8, 7, 6, 5, 4, 3, 2, 1], quadrant: 1 },
    { arch: "Maxillary", side: "left", positions: [1, 2, 3, 4, 5, 6, 7, 8], quadrant: 2 },
    { arch: "Mandibular", side: "left", positions: [8, 7, 6, 5, 4, 3, 2, 1], quadrant: 3 },
    { arch: "Mandibular", side: "right", positions: [1, 2, 3, 4, 5, 6, 7, 8], quadrant: 4 },
  ] as const;
  const positionNames = ["", "central incisor", "lateral incisor", "canine", "first premolar", "second premolar", "first molar", "second molar", "third molar"];
  const classNames = ["", "Incisor", "Incisor", "Canine", "Premolar", "Premolar", "Molar", "Molar", "Molar"];
  const definitions: Record<string, string> = {
    Incisor: "An anterior tooth with an incisal edge rather than an occlusal table.",
    Canine: "A corner tooth with one dominant cusp and the longest average root in the dentition.",
    Premolar: "A transitional posterior tooth located between the canine and molars.",
    Molar: "A broad posterior tooth with a multi-cusped occlusal surface.",
  };
  const functions: Record<string, string> = {
    Incisor: "Cuts and shears food; contributes to speech, esthetics, and anterior guidance.",
    Canine: "Pierces and tears food; supports the arch corner and often guides lateral movement.",
    Premolar: "Tears and crushes food while transitioning forces from canines to molars.",
    Molar: "Crushes and grinds food and provides the largest posterior occlusal table.",
  };
  let universal = 1;
  return sequence.flatMap(({ arch, side, positions, quadrant }) =>
    positions.map((position) => {
      const type = classNames[position];
      const isMaxillary = arch === "Maxillary";
      const roots =
        position === 8 ? "Variable" :
        position >= 6 ? (isMaxillary ? "Usually 3" : "Usually 2") :
        position === 4 && isMaxillary ? "Usually 2" : "Usually 1";
      const cusps =
        position <= 2 ? "None (incisal edge)" :
        position === 3 ? "1" :
        position === 5 && !isMaxillary ? "Usually 2–3" :
        position <= 5 ? "Usually 2" :
        position === 6 && !isMaxillary ? "Usually 5" :
        position === 6 ? "Usually 4 major" :
        position === 7 ? "Usually 4" : "Variable";
      const eruptionMax = ["", "7–8", "8–9", "11–12", "10–11", "10–12", "6–7", "12–13", "17–21"];
      const eruptionMand = ["", "6–7", "7–8", "9–10", "10–12", "11–12", "6–7", "11–13", "17–21"];
      const name = `${arch} ${side} ${positionNames[position]}`;
      return {
        fdi: quadrant * 10 + position,
        universal: universal++,
        name,
        type,
        roots,
        cusps,
        eruption: `${(isMaxillary ? eruptionMax : eruptionMand)[position]} years`,
        definition: definitions[type],
        function: functions[type],
        recognition:
          type === "Incisor" ? "Orient by incisal angles, cingulum position, lingual anatomy, and root curvature." :
          type === "Canine" ? "Look for a prominent labial ridge, one cusp, a bulky cingulum, and a long root." :
          type === "Premolar" ? "Compare cusp size, central groove pattern, crown outline, and root number." :
          "Compare cusp count, groove pattern, crown outline, oblique ridge presence, and root arrangement.",
        pearl:
          type === "Molar" ? "Trace marginal ridges and developmental grooves, then compare the occlusal outline." :
          type === "Incisor" ? "Compare mesioincisal and distoincisal angles before using root curvature." :
          "Use crown contour, cusp slopes, and root form together—never a single feature.",
      };
    })
  );
}

const modules = [
  { id: "dentition", icon: "◉", label: "Dentition & arches", count: "5 full-arch labs" },
  { id: "head", icon: "◎", label: "Head & neck", count: "8 structures" },
  { id: "skeleton", icon: "♢", label: "Skeleton & spine", count: "33 levels" },
  { id: "library", icon: "▤", label: "Anatomy library", count: "28 study units" },
  { id: "body", icon: "⌁", label: "Body systems", count: "8 systems" },
  { id: "histology", icon: "▦", label: "Histology", count: "6 tissues" },
  { id: "pathology", icon: "◇", label: "Oral pathology", count: "4 patterns" },
];

const systems = [
  ["Skeletal", "Bones, cartilage, joints, and supporting connective tissues.", "Supports and protects the body, enables movement, stores minerals, and houses marrow.", "Skull, jaws, TMJ, alveolar bone, and tooth-support relationships.", "#d9c8a8"],
  ["Muscular", "Skeletal, cardiac, and smooth muscle tissues that generate force.", "Produces movement, stabilizes posture, propels contents, and generates heat.", "Muscles of mastication, facial expression, tongue, pharynx, and posture.", "#bd6e65"],
  ["Nervous", "Brain, spinal cord, peripheral nerves, and sensory receptors.", "Detects stimuli, integrates information, and coordinates rapid responses.", "Cranial nerves, pain pathways, autonomics, and local-anesthesia targets.", "#e8b943"],
  ["Cardiovascular", "The heart, blood, and blood vessels.", "Transports gases, nutrients, hormones, immune cells, heat, and wastes.", "Hemostasis, perfusion, blood pressure, and cardiovascular dental risk.", "#a84f55"],
  ["Respiratory", "Airways, lungs, and respiratory muscles.", "Ventilates the lungs and exchanges oxygen and carbon dioxide.", "Airway assessment, oxygenation, ventilation, and respiratory emergencies.", "#77aeb0"],
  ["GI & hepatic", "Digestive tract plus accessory organs including the liver and pancreas.", "Digests and absorbs nutrients; the liver processes nutrients, drugs, and toxins.", "Oral phase of digestion, swallowing, nutrition, and medication metabolism.", "#b57852"],
  ["Endocrine", "Hormone-producing glands and dispersed endocrine cells.", "Coordinates metabolism, growth, stress responses, reproduction, and homeostasis.", "Diabetes, adrenal stress responses, thyroid disease, and oral effects.", "#8c73a5"],
  ["Renal", "Kidneys, ureters, bladder, and urethra.", "Regulates fluid, electrolytes, acid–base balance, waste excretion, and blood pressure.", "Renal drug clearance, bleeding/anemia considerations, and dialysis timing.", "#b98a73"],
] as const;

const headStructures = [
  ["Skull & jaws", "The cranial and facial skeleton, including the maxilla and mandible.", "Protects the brain and sensory organs; supports the face, teeth, and muscles.", "Orient the cranial base, foramina, maxillary sinus, mandibular canal, and alveolar processes.", "#d9c8a8"],
  ["Temporomandibular joint", "A paired synovial joint between the mandibular condyle and temporal bone.", "Permits rotation and translation during opening, closing, protrusion, and lateral movement.", "Relate the articular disc, capsule, lateral ligament, and muscle pull to jaw movement.", "#4f8f8c"],
  ["Muscles of mastication", "Masseter, temporalis, medial pterygoid, and lateral pterygoid.", "Elevate, depress, protrude, retrude, and move the mandible laterally.", "Learn origin, insertion, action, and mandibular-division innervation as one unit.", "#bd6e65"],
  ["Trigeminal nerve (CN V)", "The major sensory nerve of the face and motor nerve to muscles derived from the first pharyngeal arch.", "Carries facial and oral sensation; V3 supplies motor fibers to muscles of mastication.", "Trace V1, V2, and V3 through their skull foramina and connect branches to anesthesia regions.", "#e8b943"],
  ["Facial nerve (CN VII)", "A mixed cranial nerve supplying facial expression and carrying taste and parasympathetic fibers.", "Controls facial expression; carries taste from the anterior tongue and secretomotor fibers to glands.", "Separate motor facial branches from chorda tympani and parasympathetic pathways.", "#d19b45"],
  ["Salivary glands", "Major parotid, submandibular, and sublingual glands plus numerous minor glands.", "Produce saliva for lubrication, buffering, digestion, remineralization, and antimicrobial defense.", "Trace each major duct, gland location, secretion type, and autonomic supply.", "#77aeb0"],
  ["Oral cavity & pharynx", "The mouth and muscular passage connecting nasal and oral cavities with the esophagus and larynx.", "Supports mastication, taste, speech, swallowing, and airway protection.", "Organize spaces, tongue muscles, palate, pharyngeal constrictors, and swallowing phases.", "#8c73a5"],
  ["Fascial spaces", "Potential spaces between layers of deep cervical fascia.", "Permit movement between tissue planes but can also provide pathways for infection spread.", "Map common odontogenic sources to buccal, canine, submandibular, sublingual, and deep neck spaces.", "#b98a73"],
] as const;

const tissues = [
  ["Enamel", "The highly mineralized, acellular outer covering of the anatomic crown.", "Protects underlying dentin and resists wear and chemical challenge.", "Enamel rods extend from the dentinoenamel junction toward the surface."],
  ["Dentin", "A vital mineralized tissue forming most of the tooth.", "Supports enamel and transmits thermal, chemical, and mechanical stimuli toward the pulp.", "Dentinal tubules extend from the pulp toward the DEJ or cementodentinal junction."],
  ["Dental pulp", "Specialized, vascular, innervated connective tissue inside the tooth.", "Forms dentin, nourishes dentin, senses injury, and mounts defensive responses.", "Identify the odontoblast layer at the periphery and vessels and nerves centrally."],
  ["Cementum", "Avascular mineralized tissue covering the anatomic root.", "Provides attachment for periodontal ligament fibers and participates in repair.", "A thin layer over root dentin, usually thicker toward the apex."],
  ["Periodontal ligament", "Specialized fibrous connective tissue between cementum and alveolar bone.", "Suspends the tooth, distributes load, supports sensation, nutrition, and remodeling.", "Dense collagen fiber bundles span a narrow vascular space around the root."],
  ["Oral epithelium", "Stratified squamous epithelium lining the oral cavity.", "Forms a protective barrier adapted to mechanical stress and local function.", "Keratinized regions have a surface keratin layer; nonkeratinized regions retain nuclei superficially."],
] as const;

const lesions = [
  ["Leukoplakia", "A predominantly white plaque of questionable risk after other known white disorders are excluded.", "Practice describing color, texture, borders, site, size, and whether it wipes off."],
  ["Erythroplakia", "A predominantly red patch that cannot be clinically characterized as another condition.", "Recognize that persistent red lesions require careful professional evaluation."],
  ["Mucocele", "A mucus-filled swelling caused most often by extravasated salivary mucus after duct trauma.", "Relate the fluctuant appearance and common lower-lip location to minor salivary glands."],
  ["Aphthous ulcer", "A recurrent, painful oral ulcer with a fibrinous base and erythematous halo.", "Distinguish an ulcer from a vesicle, erosion, plaque, macule, and mass."],
] as const;

const references = [
  ["ADA Universal Tooth Designation System", "https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/publications/cdt/ada_utds_value_set_v1_2022_aug.pdf"],
  ["ADA permanent-tooth eruption chart", "https://jada.ada.org/article/S0002-8177(14)63841-1/fulltext"],
  ["NCBI: Histology, Tooth", "https://www.ncbi.nlm.nih.gov/books/NBK572055/"],
  ["NCBI: Histology, Periodontium", "https://www.ncbi.nlm.nih.gov/books/NBK570604/"],
  ["NCBI: Vertebral column anatomy", "https://www.ncbi.nlm.nih.gov/books/NBK525969/"],
  ["NCBI: Cervical vertebrae", "https://www.ncbi.nlm.nih.gov/books/NBK459200/"],
  ["NCBI: Atlantoaxial joint", "https://www.ncbi.nlm.nih.gov/books/NBK563271/"],
  ["NCBI: Thoracic vertebrae", "https://www.ncbi.nlm.nih.gov/books/NBK459153/"],
  ["NCBI: Lumbar vertebrae", "https://www.ncbi.nlm.nih.gov/books/NBK459278/"],
  ["NCBI: Sacral vertebrae", "https://www.ncbi.nlm.nih.gov/books/NBK551653/"],
  ["ADA workplace ergonomics", "https://www.ada.org/resources/practice/wellness/workplace-ergonomics"],
  ["OpenStax Anatomy & Physiology 2e", "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-introduction"],
  ["University of Dundee dental 3D collection", "https://sketchfab.com/DundeeDental"],
  ["University of Dundee complete permanent dentition", "https://sketchfab.com/3d-models/permanent-dentition-2f69d7b59c3e4a6a8bcae041bd8e591b"],
  ["AnatomyTOOL open anatomy learning resources", "https://anatomytool.org/about"],
];

type Model3D = {
  uid: string;
  title: string;
  creator: string;
  note?: string;
};

const toothModels: Record<string, Model3D> = {
  maxillary1: { uid: "c8a7c2d9280d4c92bc651cfa1459866a", title: "Maxillary central incisor", creator: "University of Dundee School of Dentistry" },
  maxillary2: { uid: "5e89ddbfc6454e2e8e09c645574b8932", title: "Maxillary lateral incisor", creator: "University of Dundee School of Dentistry" },
  maxillary3: { uid: "bd930c9b9da14f2a9a8c9b130b0e08a2", title: "Maxillary canine", creator: "University of Dundee School of Dentistry" },
  maxillary4: { uid: "f9b48a29d34f4923b683433f030c5c70", title: "Maxillary first premolar", creator: "University of Dundee School of Dentistry" },
  maxillary5: { uid: "69f3142830064588b000b04bea0ee09f", title: "Maxillary second premolar", creator: "University of Dundee School of Dentistry" },
  maxillary6: { uid: "e719a474ef7e4bd7abec508f85f1e984", title: "Maxillary first molar", creator: "University of Dundee School of Dentistry" },
  maxillary7: { uid: "e035713849d1438791306e25235ac452", title: "Maxillary second molar", creator: "University of Dundee School of Dentistry" },
  maxillary8: { uid: "1b3c50ded70c4b6297d4526a733a9cf1", title: "Maxillary third molar", creator: "University of Dundee School of Dentistry" },
  mandibular1: { uid: "90dcbf474e5a4d97b8783b7eb2b9c4b7", title: "Mandibular central incisor", creator: "University of Dundee School of Dentistry" },
  mandibular2: { uid: "4cffce2a3aee498db129890f8effe5ee", title: "Mandibular lateral incisor", creator: "University of Dundee School of Dentistry", note: "This model demonstrates a documented two-canal variation; canal anatomy can vary." },
  mandibular3: { uid: "1082011ab5aa46bb96b2af6a02a4ec0c", title: "Mandibular canine", creator: "University of Dundee School of Dentistry" },
  mandibular4: { uid: "935637a703dc49eb9eeec9b15a8a5c4c", title: "Mandibular first premolar", creator: "University of Dundee School of Dentistry" },
  mandibular5: { uid: "fe59fe04725446479bc1115bb12d0ad8", title: "Mandibular second premolar", creator: "University of Dundee School of Dentistry" },
  mandibular6: { uid: "e1c919d6603846eca873154eeededdd6", title: "Mandibular first molar", creator: "University of Dundee School of Dentistry" },
  mandibular7: { uid: "b77dcbc5052e4740b87cdb1964649742", title: "Mandibular second molar", creator: "University of Dundee School of Dentistry" },
  mandibular8: { uid: "561bb06b3b084b84978163906de1c2b5", title: "Mandibular third molar", creator: "University of Dundee School of Dentistry" },
};

const fullArchModels: Model3D[] = [
  {
    uid: "2f69d7b59c3e4a6a8bcae041bd8e591b",
    title: "Complete permanent dentition",
    creator: "University of Dundee School of Dentistry",
    note: "A complete maxillary and mandibular permanent dentition created from CT data. Begin here for arch form, tooth position, and inter-arch relationships.",
  },
  {
    uid: "11d687b08cd94937831430cccb9a6870",
    title: "Animated orofacial anatomy",
    creator: "Ebers",
    note: "Relates the maxilla, mandible, maxillary teeth, and mandibular teeth during movement.",
  },
  {
    uid: "d207f3b038ba49e89ccab7bfa5775467",
    title: "Skull with permanent dentition",
    creator: "RealDoCC",
    note: "Use this view to connect roots and arches with the maxilla, mandible, cranial base, and facial skeleton.",
  },
  {
    uid: "f961f6262b0340b69e4904549e1f47c8",
    title: "CBCT-derived maxilla and mandible",
    creator: "epres",
    note: "A patient-derived bony model for studying jaw relationships and radiographic three-dimensional orientation.",
  },
  {
    uid: "4dc37755ec614631aa7018dd5acdd718",
    title: "Permanent dentition eruption",
    creator: "John A Burns School of Medicine",
    note: "Use this developmental model to review eruption sequence and the relationship between developing and erupted teeth.",
  },
];

const headModels: Model3D[] = [
  { uid: "76e6bdbfd39f40dbab847ba7c382ad60", title: "Head and neck anatomy for dentistry", creator: "University of Dundee" },
  { uid: "a9358ee7a6dd4ea18a3622114405a4c7", title: "Cranial nerves and skull foramina", creator: "University of Dundee" },
  { uid: "2277712fe86c4993a66cff01ef9b0d11", title: "Maxilla", creator: "University of Dundee School of Dentistry" },
  { uid: "7a3c3b99916e481197e6f18fda107c15", title: "Mandible", creator: "University of Dundee School of Dentistry" },
  { uid: "64d4e31440ba48ee9e1ecccf6fe0ac17", title: "Oral cavity", creator: "University of Dundee" },
  { uid: "b262c70bf9bd49c2a5428581b754f24b", title: "Pharynx and floor of mouth", creator: "University of Dundee" },
];

const bodyModels: Model3D[] = [
  { uid: "7235c83248574ce986dd9e8b35159afa", title: "CT-derived human skeleton", creator: "Open anatomy contributor" },
  { uid: "4b1904e42d0e4882810ac9476dcec921", title: "Head and neck écorché", creator: "Anatomy education contributor" },
  { uid: "2e6be1399756494b9f185ce8c5900911", title: "Nervous system", creator: "University of Dundee" },
  { uid: "a3f0ea2030214a6bbaa97e7357eebd58", title: "External cardiac anatomy", creator: "University of Dundee medical art" },
  { uid: "ad7d7e16b98f421db0cda79f265fcc8d", title: "Airway anatomy", creator: "E-learning anatomy contributor" },
  { uid: "7616eaf43292459d824636197333b6df", title: "Hemisected brain", creator: "University of Dundee" },
  { uid: "76e6bdbfd39f40dbab847ba7c382ad60", title: "Dental head and neck anatomy", creator: "University of Dundee" },
];

const skeletonModels: Model3D[] = [
  { uid: "7235c83248574ce986dd9e8b35159afa", title: "Complete CT-derived human skeleton", creator: "Open anatomy contributor", note: "Use the model inspector and fullscreen view to isolate regions." },
  { uid: "bcd9eee09ce044ef98a69c315aa792e2", title: "Complete vertebral column", creator: "3D anatomy contributor" },
  { uid: "98f4cbd06fdf4350a4c3485439705607", title: "Labeled cervical spine, nerves, and vertebral arteries", creator: "Anatomy education contributor" },
  { uid: "03657338956d41158be94cf19b150402", title: "Atlas (C1) annotated bone scan", creator: "Elon University anatomy laboratory" },
  { uid: "34eda94dbc264baab7757eb34e1f9b04", title: "Axis (C2) annotated bone scan", creator: "Elon University anatomy laboratory" },
  { uid: "29b6bb536df84df08fa0ad444c3b01d1", title: "Typical cervical vertebra (C3/C4) bone scan", creator: "Elon University anatomy laboratory" },
  { uid: "e0bc4d3712b54f35a685a020b1eac361", title: "Vertebra prominens (C7) scan", creator: "Mesa Community College anatomy laboratory" },
  { uid: "d4af33ccf03b4fec8754180bcb480516", title: "Spinal cord, roots, and meninges", creator: "University of Dundee" },
];

type AnatomyUnit = {
  id: string;
  region: string;
  system: string;
  name: string;
  structures: string;
  function: string;
  relations: string;
  dental: string;
  model: Model3D;
};

const anatomyUnits: AnatomyUnit[] = [
  {
    id: "cranial-base", region: "Head & neck", system: "Skeletal", name: "Skull, cranial base & foramina",
    structures: "Neurocranium, viscerocranium, calvaria, anterior/middle/posterior cranial fossae, sutures, foramina, canals, fossae, maxilla, mandible, hyoid.",
    function: "Protects the brain and sensory organs, supports the face, and provides passages and attachment sites for nerves, vessels, fascia, and muscles.",
    relations: "Orient each foramen by fossa and transmitted structure: optic canal; superior orbital fissure; foramina rotundum, ovale, and spinosum; carotid canal; jugular foramen; hypoglossal canal; foramen magnum.",
    dental: "Foundation for local anesthesia, cranial-nerve tracing, panoramic/CBCT orientation, fascial-space spread, orthognathic surgery, and trauma interpretation.",
    model: headModels[1],
  },
  {
    id: "jaws-alveolus", region: "Head & neck", system: "Skeletal", name: "Maxilla, mandible & alveolar process",
    structures: "Maxillary body and processes, maxillary sinus, mandibular body and ramus, condyle, coronoid, mandibular canal, mental foramen, alveolar bone proper, cortical plates.",
    function: "Supports the dentition, transmits masticatory load, shapes the face and oral cavity, and houses major neurovascular pathways.",
    relations: "Trace tooth roots to cortical plates, sinus floor, nasal floor, mandibular canal, mental foramen, lingual concavity, mylohyoid line, and muscle attachments.",
    dental: "Essential for extraction risk, implant planning, local anesthesia, periodontal bone assessment, radiology, endodontics, prosthodontics, and oral surgery.",
    model: headModels[2],
  },
  {
    id: "tmj", region: "Head & neck", system: "Articular", name: "Temporomandibular joint",
    structures: "Mandibular condyle, mandibular fossa, articular eminence, fibrocartilaginous disc, superior/inferior joint spaces, capsule, lateral ligament, retrodiscal tissues.",
    function: "Combines rotation and translation for opening, closing, protrusion, retrusion, and lateral excursion.",
    relations: "Relate disc-condyle motion to the articular eminence; connect lateral pterygoid pull, retrodiscal tissues, occlusion, auriculotemporal nerve, and superficial temporal/maxillary vessels.",
    dental: "Supports occlusal analysis, examination of range/deviation, splint concepts, patient positioning, and understanding pain referral without replacing clinical diagnosis.",
    model: fullArchModels[1],
  },
  {
    id: "mastication-face", region: "Head & neck", system: "Muscular", name: "Mastication & facial expression",
    structures: "Masseter, temporalis, medial/lateral pterygoids; buccinator; orbicularis oris; suprahyoid and infrahyoid groups; muscles of facial expression.",
    function: "Positions the mandible, controls the food bolus, seals the lips and cheeks, supports speech, expression, swallowing, and hyoid movement.",
    relations: "Learn origin, insertion, action, innervation, fascial compartment, and line of pull together. Contrast V3 motor supply with facial-nerve motor supply.",
    dental: "Explains jaw movement, trismus, injection landmarks, denture control, smile dynamics, parafunction, and operator palpation during examination.",
    model: bodyModels[1],
  },
  {
    id: "oral-cavity", region: "Head & neck", system: "Digestive", name: "Oral cavity, tongue & palate",
    structures: "Vestibule, oral cavity proper, lips, cheeks, hard/soft palate, tongue papillae, intrinsic/extrinsic tongue muscles, floor of mouth, lingual frenulum.",
    function: "Initiates digestion and swallowing; enables mastication, taste, speech, bolus formation, oral competence, and airway protection.",
    relations: "Map mucosal regions, muscle planes, sensory/taste innervation, blood supply, lymphatic drainage, sublingual spaces, and the relationship of tongue to mandible and hyoid.",
    dental: "Central to soft-tissue examination, cancer screening, prosthesis design, speech, gag reflex, local anesthesia, infection spread, and surgical access.",
    model: headModels[4],
  },
  {
    id: "salivary", region: "Head & neck", system: "Digestive", name: "Salivary glands & ducts",
    structures: "Parotid, submandibular, sublingual, and minor glands; Stensen and Wharton ducts; myoepithelial cells; serous and mucous acini.",
    function: "Lubricates, buffers, cleanses, protects, begins digestion, supports taste, and supplies calcium and phosphate for remineralization.",
    relations: "Trace each duct, parasympathetic pathway, arterial supply, lymphatics, and relationship to facial nerve, lingual nerve, hypoglossal nerve, mylohyoid, and floor of mouth.",
    dental: "Explains xerostomia, sialolith risk, caries susceptibility, gland examination, medication effects, and surgical anatomy.",
    model: headModels[5],
  },
  {
    id: "cranial-nerves", region: "Head & neck", system: "Nervous", name: "Cranial nerves & autonomics",
    structures: "CN I–XII with emphasis on V, VII, IX, X, XI, XII; trigeminal ganglion; pterygopalatine, submandibular, otic, and ciliary ganglia; sympathetic chain.",
    function: "Provides sensation, taste, motor control, gland secretion, visceral regulation, hearing, balance, vision, smell, and airway/swallowing coordination.",
    relations: "Follow each nerve from nucleus to skull exit, named branches, target, modality, and lesion pattern. Keep trigeminal sensory maps separate from facial motor branches.",
    dental: "Directly supports local anesthesia, pain referral, facial weakness assessment, gag reflex, taste disturbance, salivary control, and surgical risk.",
    model: headModels[1],
  },
  {
    id: "head-vessels-lymph", region: "Head & neck", system: "Cardiovascular", name: "Arteries, veins & lymphatics of the head and neck",
    structures: "Common/internal/external carotids, maxillary and facial arteries, pterygoid plexus, dural sinuses, internal jugular vein, superficial and deep cervical lymph nodes.",
    function: "Supplies and drains the brain, face, oral cavity, teeth, glands, and neck; lymphatics support immune surveillance and disease spread.",
    relations: "Trace external-carotid branches and anastomoses; connect dental arteries to parent vessels; map venous communications and site-specific lymphatic drainage.",
    dental: "Essential for hemorrhage control, injection safety, infection spread, cancer staging concepts, flap design, and interpreting pulsatile or vascular lesions.",
    model: headModels[0],
  },
  {
    id: "vertebral-column", region: "Back", system: "Skeletal", name: "Vertebral column & intervertebral joints",
    structures: "C1–Co4, bodies, arches, processes, discs, zygapophyseal joints, longitudinal/flaval/interspinous/supraspinous ligaments, sacrum, coccyx.",
    function: "Supports the head and trunk, protects the spinal cord, transmits load, allows controlled motion, and anchors muscles and ribs.",
    relations: "Compare regional vertebral patterns; follow load through bodies/discs and motion guidance through facets; connect spinal curves to pelvis and head position.",
    dental: "Cervical mobility, neutral posture, head-rest positioning, airway alignment, vertebral-artery awareness, and operator ergonomics.",
    model: skeletonModels[1],
  },
  {
    id: "spinal-cord", region: "Back", system: "Nervous", name: "Spinal cord, roots & meninges",
    structures: "Cord segments, gray/white matter, dorsal and ventral roots, spinal nerves, dorsal-root ganglia, cauda equina, dura, arachnoid, pia, epidural and subarachnoid spaces.",
    function: "Conducts ascending sensory and descending motor information and integrates spinal reflexes.",
    relations: "Relate cord segments to vertebral levels, nerve exits, dermatomes, myotomes, sympathetic outflow, CSF spaces, and meningeal coverings.",
    dental: "Supports safe positioning, recognition of neurologic red flags, autonomic physiology, pain pathways, and understanding referred symptoms.",
    model: skeletonModels[7],
  },
  {
    id: "deep-back", region: "Back", system: "Muscular", name: "Deep back, suboccipital region & posture",
    structures: "Erector spinae, transversospinales, segmental muscles, thoracolumbar fascia, suboccipital muscles, nuchal ligament.",
    function: "Extends, rotates, and stabilizes the spine and head while maintaining posture and proprioception.",
    relations: "Connect muscle fiber direction to movement; relate upper cervical muscles to occiput/C1/C2 and global posture to scapular and pelvic position.",
    dental: "Explains sustained neck loading, operator fatigue, patient head support, and why lumbar/thoracic setup changes cervical strain.",
    model: bodyModels[1],
  },
  {
    id: "thoracic-wall", region: "Thorax", system: "Musculoskeletal", name: "Thoracic wall, ribs & diaphragm",
    structures: "Sternum, ribs, costal cartilages, intercostal spaces, intercostal neurovascular bundles, diaphragm, pleura, thoracic inlet and outlet.",
    function: "Protects thoracic organs and changes thoracic volume for ventilation.",
    relations: "Relate rib motion to vertebral and sternal joints; trace intercostal VAN order; map diaphragm openings and phrenic innervation.",
    dental: "Provides the mechanics behind breathing, patient positioning, chest observation during emergencies, and referred shoulder pain from diaphragmatic irritation.",
    model: bodyModels[0],
  },
  {
    id: "lungs-airway", region: "Thorax", system: "Respiratory", name: "Airway, lungs & pleura",
    structures: "Nasal-to-laryngeal airway, trachea, bronchi, bronchopulmonary segments, lungs, pleural cavities, pulmonary circulation.",
    function: "Conducts air, exchanges oxygen and carbon dioxide, regulates acid-base balance, and supports phonation.",
    relations: "Trace airway narrowing points, right/left bronchial differences, lobes and fissures, pleural reflections, ventilation-perfusion relationships, and autonomic control.",
    dental: "Essential for airway assessment, aspiration risk, oxygen delivery, asthma/COPD considerations, sedation monitoring, and respiratory emergencies.",
    model: bodyModels[4],
  },
  {
    id: "heart", region: "Thorax", system: "Cardiovascular", name: "Heart, valves & coronary circulation",
    structures: "Four chambers, valves, fibrous skeleton, conduction system, coronary arteries and veins, pericardium, great vessels.",
    function: "Generates pressure and one-way blood flow through pulmonary and systemic circuits.",
    relations: "Follow blood flow chamber by chamber; map valve sounds, conduction sequence, coronary territories, pericardial layers, and autonomic effects.",
    dental: "Supports medical-risk assessment, blood-pressure interpretation, infective-endocarditis concepts, anticoagulant awareness, angina/MI response, and drug effects.",
    model: bodyModels[3],
  },
  {
    id: "mediastinum", region: "Thorax", system: "Regional", name: "Mediastinum & major thoracic pathways",
    structures: "Superior and inferior mediastina; thymus, trachea, esophagus, aorta, venae cavae, thoracic duct, vagus and phrenic nerves, sympathetic trunks.",
    function: "Organizes passage and relationships among the heart, airway, gut, vessels, nerves, and lymphatics.",
    relations: "Use cross-sections to identify anterior/posterior and right/left relationships; follow recurrent laryngeal, vagal, phrenic, and sympathetic pathways.",
    dental: "Connects head-and-neck anatomy with thoracic autonomics, swallowing, voice, deep infection spread, and cardiopulmonary emergencies.",
    model: bodyModels[4],
  },
  {
    id: "gi", region: "Abdomen", system: "Digestive", name: "GI tract & peritoneum",
    structures: "Esophagus, stomach, small and large intestine, mesenteries, greater/lesser sacs, peritoneal folds and recesses.",
    function: "Digests food, absorbs nutrients and water, propels contents, and provides immune and endocrine signaling.",
    relations: "Organize organs as intraperitoneal or retroperitoneal; trace foregut/midgut/hindgut blood supply, parasympathetics, sympathetics, and lymphatics.",
    dental: "Explains nutrition, reflux, vomiting/aspiration, inflammatory bowel disease, medication absorption, and oral manifestations of systemic disease.",
    model: bodyModels[0],
  },
  {
    id: "hepatobiliary", region: "Abdomen", system: "Digestive", name: "Liver, biliary tree & pancreas",
    structures: "Liver lobes and segments, portal triad, hepatic veins, gallbladder, bile ducts, pancreas, pancreatic ducts, portal venous system.",
    function: "Metabolizes nutrients and drugs, synthesizes proteins, detoxifies, produces bile, and provides digestive and endocrine pancreatic functions.",
    relations: "Trace portal versus systemic blood, bile flow, pancreatic duct drainage, and relationships to duodenum, stomach, spleen, and major vessels.",
    dental: "Important for drug metabolism, bleeding risk, jaundice, diabetes, alcohol-related disease, nutrition, and medication selection.",
    model: bodyModels[0],
  },
  {
    id: "renal", region: "Abdomen", system: "Urinary", name: "Kidneys, ureters & adrenal glands",
    structures: "Renal cortex/medulla, nephrons, collecting system, renal vessels, ureters, adrenal cortex and medulla.",
    function: "Regulates volume, electrolytes, acid-base balance, waste excretion, blood pressure, erythropoiesis, and stress hormones.",
    relations: "Relate nephron segments to function; trace ureteric constrictions, renal vascular branching, retroperitoneal position, and adrenal hormone zones.",
    dental: "Guides renal drug dosing, dialysis timing, anemia/bleeding awareness, hypertension assessment, steroid considerations, and emergency physiology.",
    model: bodyModels[0],
  },
  {
    id: "abdominal-vessels", region: "Abdomen", system: "Cardiovascular", name: "Abdominal vessels, lymphatics & autonomics",
    structures: "Aorta, IVC, celiac/SMA/IMA branches, portal system, cisterna chyli, lumbar plexus, sympathetic trunks and prevertebral plexuses.",
    function: "Distributes and returns blood, drains lymph, and controls visceral motor and sensory activity.",
    relations: "Pair arterial territories with embryologic gut regions; distinguish portal from caval drainage and visceral from somatic pain pathways.",
    dental: "Builds systemic physiology for shock, hypertension, drug effects, referred pain, and medical-emergency reasoning.",
    model: bodyModels[2],
  },
  {
    id: "pelvic-floor", region: "Pelvis & perineum", system: "Musculoskeletal", name: "Bony pelvis, pelvic floor & perineum",
    structures: "Hip bones, sacrum, pelvic inlet/outlet, sacroiliac joints, pelvic diaphragm, perineal membrane, ischioanal fossae.",
    function: "Transfers trunk weight, supports pelvic viscera, maintains continence, and provides passage for urinary, reproductive, and GI systems.",
    relations: "Compare true/false pelvis; map levator ani components, fascial supports, pudendal canal, perineal pouches, and load transfer through SI joints.",
    dental: "Pelvic support determines seated spinal curves and therefore operator and patient head-neck posture during prolonged care.",
    model: bodyModels[0],
  },
  {
    id: "pelvic-viscera", region: "Pelvis & perineum", system: "Urinary", name: "Bladder, urethra & rectum",
    structures: "Bladder, ureters, urethra, rectum, anal canal, sphincters, pelvic autonomic plexuses, regional vessels and lymphatics.",
    function: "Stores and eliminates urine and feces while coordinating continence and pelvic autonomic reflexes.",
    relations: "Trace fascial spaces, organ support, sympathetic/parasympathetic/somatic control, blood supply, and lymphatic drainage.",
    dental: "Relevant to renal/urinary medications, autonomic drug effects, dehydration, medical histories, and safe accommodation during long appointments.",
    model: bodyModels[2],
  },
  {
    id: "reproductive", region: "Pelvis & perineum", system: "Reproductive", name: "Reproductive anatomy",
    structures: "Internal and external reproductive organs, gonads, ducts, accessory glands, erectile tissues, supporting ligaments, vessels and lymphatics.",
    function: "Produces gametes and sex hormones and supports reproduction, pregnancy, and lactation.",
    relations: "Connect embryologic homologues, endocrine regulation, organ support, vascular supply, autonomics, and lymphatic routes.",
    dental: "Supports medication and pregnancy considerations, hormonal oral changes, osteoporosis risk, and respectful comprehensive health history.",
    model: bodyModels[0],
  },
  {
    id: "upper-limb-msk", region: "Upper limb", system: "Musculoskeletal", name: "Upper-limb bones, joints & muscles",
    structures: "Pectoral girdle, humerus, radius, ulna, hand; shoulder, elbow, wrist joints; rotator cuff and arm/forearm/hand compartments.",
    function: "Positions the hand, provides reach and precision, and transmits forces through linked joints.",
    relations: "Learn compartments by action, innervation, blood supply, and fascial boundaries; connect scapular rotation to cervical and thoracic posture.",
    dental: "Highly relevant to hand instrumentation, grip, fine motor control, repetitive strain, shoulder positioning, and ergonomic endurance.",
    model: bodyModels[0],
  },
  {
    id: "upper-limb-nv", region: "Upper limb", system: "Nervous", name: "Brachial plexus & upper-limb vessels",
    structures: "Roots, trunks, divisions, cords, terminal nerves; axillary/brachial/radial/ulnar arteries; superficial and deep veins.",
    function: "Supplies motor, sensory, sympathetic, and vascular support to the upper limb.",
    relations: "Trace each terminal nerve through compartments and entrapment sites; pair lesions with motor/sensory findings and arterial pulse points.",
    dental: "Explains hand symptoms, nerve-compression risks, operator positioning, IV sites, blood-pressure cuff placement, and occupational injury prevention.",
    model: bodyModels[2],
  },
  {
    id: "lower-limb-msk", region: "Lower limb", system: "Musculoskeletal", name: "Lower-limb bones, joints & muscles",
    structures: "Hip, femur, patella, tibia, fibula, foot; hip, knee, ankle; gluteal, thigh, leg, and foot compartments.",
    function: "Supports body weight, maintains balance, absorbs load, and produces locomotion.",
    relations: "Organize compartments by action, innervation, blood supply, fascial boundaries, and joint biomechanics; connect foot support to pelvic and spinal posture.",
    dental: "Supports whole-body ergonomics, stable seated stance, circulation awareness, mobility accommodation, and fall-risk considerations.",
    model: bodyModels[0],
  },
  {
    id: "lower-limb-nv", region: "Lower limb", system: "Nervous", name: "Lumbosacral plexus & lower-limb vessels",
    structures: "Femoral, obturator, sciatic, tibial and fibular nerves; femoral/popliteal/tibial arteries; superficial and deep veins; lymphatics.",
    function: "Provides motor, sensory, autonomic, vascular, and lymphatic support to the lower limb.",
    relations: "Trace nerves through compartments and common injury sites; follow arterial continuation and venous return from foot to pelvis.",
    dental: "Relevant to neuropathy, diabetes, thromboembolic risk, mobility limits, and safe positioning during lengthy procedures.",
    model: bodyModels[2],
  },
  {
    id: "brain", region: "Whole body", system: "Nervous", name: "Brain, brainstem & sensory systems",
    structures: "Cerebral lobes, basal nuclei, diencephalon, brainstem, cerebellum, ventricles, meninges, arterial circle, major motor/sensory pathways.",
    function: "Integrates sensation, movement, cognition, language, memory, emotion, autonomic control, and cranial-nerve function.",
    relations: "Connect cortex to pathways and nuclei; map vascular territories, CSF flow, brainstem cranial-nerve levels, and special sensory systems.",
    dental: "Explains pain processing, cranial-nerve signs, stroke recognition, seizure history, consciousness, gag/airway reflexes, and behavioral responses.",
    model: bodyModels[5],
  },
  {
    id: "integrated-systems", region: "Whole body", system: "Integrated", name: "Endocrine, immune, lymphatic & integumentary systems",
    structures: "Pituitary, thyroid, parathyroids, adrenals, pancreas, gonads; marrow, thymus, spleen, lymph nodes; skin, glands, hair and nails.",
    function: "Coordinates metabolism and stress, defends against disease, returns tissue fluid, and forms the body’s protective sensory barrier.",
    relations: "Connect hormones to target organs and feedback loops; follow immune-cell development and lymph flow; relate epithelial layers to barrier and repair.",
    dental: "Integrates diabetes, thyroid/adrenal disease, immunosuppression, allergy, wound healing, infection, lymphadenopathy, and skin/mucosal examination.",
    model: bodyModels[0],
  },
];

type VertebraRecord = {
  id: string;
  region: "Cervical" | "Thoracic" | "Lumbar" | "Sacral" | "Coccygeal";
  pattern: string;
  landmarks: string;
  articulations: string;
  movement: string;
  neural: string;
  dental: string;
  interaction: string;
};

const cervicalVertebrae: VertebraRecord[] = [
  {
    id: "C1", region: "Cervical", pattern: "Atlas · atypical cervical vertebra",
    landmarks: "Ring-shaped; no body and no true spinous process. Anterior and posterior arches join large lateral masses. Superior facets are concave for the occipital condyles; the posterior arch carries grooves for the vertebral arteries and C1 nerves.",
    articulations: "Occipital condyles above at paired atlanto-occipital synovial joints; C2 below at two lateral atlantoaxial joints. The anterior arch also articulates with the dens at the median atlantoaxial pivot joint.",
    movement: "Atlanto-occipital joints mainly permit flexion and extension—the “yes” motion—with limited lateral flexion. C1 rotates around the dens with the skull during the “no” motion.",
    neural: "The C1 spinal nerve exits above the posterior arch. The vertebral artery curves across the posterior arch before entering the foramen magnum; the spinal cord lies within the large vertebral canal.",
    dental: "Head-rest positioning changes the occiput–C1 angle. Use caution with forced extension or rotation in trauma, instability, rheumatoid disease, or limited cervical mobility; airway positioning must respect the craniocervical junction.",
    interaction: "Transfers skull weight from the occipital condyles through its lateral masses to C2 while allowing motion without an intervertebral disc."
  },
  {
    id: "C2", region: "Cervical", pattern: "Axis · atypical cervical vertebra",
    landmarks: "The dens projects superiorly from the body and acts as a pivot. It has anterior and posterior articular surfaces; the posterior surface faces the transverse ligament. A robust bifid spinous process anchors deep neck muscles.",
    articulations: "Dens with the anterior arch of C1 and transverse ligament at the median atlantoaxial joint; superior facets with C1 at two lateral joints; body, disc, and facets with C3 below.",
    movement: "C1 and the skull rotate around the dens. The atlantoaxial complex supplies a large share of cervical axial rotation while the transverse and alar ligaments restrain excessive motion.",
    neural: "C2 nerve exits above C2. Vertebral arteries traverse the transverse foramina and turn laterally toward C1. The upper cord and lower medulla are immediately posterior to the dens complex.",
    dental: "Pain referred from upper cervical structures can overlap with occipital and craniofacial symptoms. Avoid aggressive neck rotation when instability is suspected; recognize the dens on appropriate head-and-neck imaging.",
    interaction: "Functions as the central pivot between C1 and the subaxial cervical spine; stability depends heavily on the transverse ligament."
  },
  {
    id: "C3", region: "Cervical", pattern: "Typical subaxial cervical vertebra",
    landmarks: "Small rectangular body with uncinate processes, large triangular vertebral foramen, transverse foramina, short often bifid spinous process, and obliquely oriented articular facets.",
    articulations: "C2–C3 and C3–C4 discs form symphyses; paired facet joints are synovial. Uncovertebral clefts develop along the superolateral body margins.",
    movement: "Contributes to coupled flexion–extension, lateral flexion, and rotation; facet orientation guides motion while discs distribute load.",
    neural: "C3 nerve exits through the C2–C3 intervertebral foramen. C3 contributes to the cervical plexus and to the phrenic nerve roots (C3–C5).",
    dental: "The hyoid is commonly near the C3 level. Relate this level to suprahyoid/infrahyoid function, swallowing, airway assessment, and cervical posture.",
    interaction: "Acts with C2 above and C4 below as a three-joint motion segment: one disc anteriorly and two facet joints posteriorly."
  },
  {
    id: "C4", region: "Cervical", pattern: "Typical subaxial cervical vertebra",
    landmarks: "Typical cervical body, uncinate processes, triangular canal, transverse foramina, and a short bifid spinous process.",
    articulations: "Disc and uncovertebral relationships with C3 and C5; paired superior and inferior articular facets form zygapophyseal joints.",
    movement: "Shares flexion–extension, lateral flexion, and axial rotation across the mid-cervical spine.",
    neural: "C4 nerve exits through C3–C4; C4 is a major contributor to the phrenic nerve. Vertebral arteries normally ascend within the transverse foramina.",
    dental: "The thyroid cartilage spans approximately C4–C5. Connect this level to airway examination, neck palpation, swallowing, and safe patient positioning.",
    interaction: "Loads pass through the body/disc column and paired posterior facets; surrounding ligaments limit translation and excessive rotation."
  },
  {
    id: "C5", region: "Cervical", pattern: "Typical subaxial cervical vertebra",
    landmarks: "Typical cervical morphology with uncinate processes, transverse foramina, a relatively large triangular canal, and bifid spinous process.",
    articulations: "C4–C5 and C5–C6 discs plus paired facet joints; uncovertebral margins flank the disc.",
    movement: "A mobile mid-cervical level contributing strongly to flexion and extension and to coupled rotation/lateral flexion.",
    neural: "C5 nerve exits through C4–C5 and contributes to the upper trunk of the brachial plexus and the phrenic nerve.",
    dental: "Sustained forward-head posture increases demand on the cervical extensors around this region—an important dental ergonomics connection.",
    interaction: "Coordinates anterior disc deformation with posterior facet gliding; degenerative narrowing can affect the exiting nerve root."
  },
  {
    id: "C6", region: "Cervical", pattern: "Typical cervical vertebra with key surface landmark",
    landmarks: "Prominent anterior tubercle of the transverse process—the carotid tubercle. Typical body, uncinate processes, triangular canal, transverse foramina, and bifid spinous process.",
    articulations: "Disc and facet motion segments with C5 and C7. The vertebral artery most commonly enters the transverse foramen at C6.",
    movement: "Participates in lower-cervical flexion–extension, lateral flexion, and rotation while transmitting increasing load toward C7.",
    neural: "C6 nerve exits through C5–C6. The cricoid cartilage and transition from pharynx to esophagus are commonly near C6; the vertebral artery entry point is clinically important.",
    dental: "C6 is a useful neck landmark for cricoid-level airway anatomy. Do not use the carotid tubercle as a pressure target in routine dental care.",
    interaction: "Transitional load-bearing level whose body/disc and facet joints couple with C5 above and C7 below."
  },
  {
    id: "C7", region: "Cervical", pattern: "Vertebra prominens · cervicothoracic transition",
    landmarks: "Large body, long usually non-bifid palpable spinous process, smaller vertebral foramen, and transverse foramina that usually transmit veins rather than the vertebral artery.",
    articulations: "C6–C7 disc/facets above and C7–T1 disc/facets below. Inferior facets begin transitioning toward thoracic orientation.",
    movement: "Transfers motion and load from the mobile neck to the stiffer thoracic region; flexion–extension remains important.",
    neural: "C7 nerve exits through C6–C7; the C8 nerve exits below C7 through C7–T1. Vertebral arteries usually enter at C6 rather than C7.",
    dental: "A palpable postural landmark. Forward-head posture and prolonged static operator positioning commonly stress the cervicothoracic junction.",
    interaction: "Links the cervical lordosis to the thoracic kyphosis and distributes load into T1 and the first-rib region."
  },
];

function makeThoracicVertebrae(): VertebraRecord[] {
  return Array.from({ length: 12 }, (_, index) => {
    const n = index + 1;
    const id = `T${n}`;
    if (n === 1) return {
      id, region: "Thoracic", pattern: "Atypical upper thoracic transition",
      landmarks: "Complete superior costal facet for rib 1, inferior demifacet for rib 2, transverse costal facet for rib 1, and a long spinous process.",
      articulations: "C7 above, T2 below, head and tubercle of rib 1, and part of the head of rib 2.",
      movement: "Limited flexion–extension; permits some rotation while the first rib and thoracic cage add stability.",
      neural: "T1 nerve exits below T1 and contributes substantially to the lower trunk of the brachial plexus.",
      dental: "Relate the C7–T1 junction to operator posture, shoulder-girdle load, and first-rib mechanics.",
      interaction: "Transitions cervical facet and body morphology into the rib-bearing thoracic column."
    };
    if (n >= 2 && n <= 8) return {
      id, region: "Thoracic", pattern: "Typical rib-bearing thoracic vertebra",
      landmarks: `Heart-shaped body, relatively circular canal, long inferiorly sloping spinous process, superior and inferior costal demifacets, and transverse costal facets for rib ${n}.`,
      articulations: `Body and facets with T${n - 1} above and T${n + 1} below. Superior demifacet receives the head of rib ${n}; inferior demifacet contributes to the head of rib ${n + 1}; transverse facet meets the tubercle of rib ${n}.`,
      movement: "Coronal facet orientation favors rotation; the rib cage and overlapping spinous processes limit flexion and extension.",
      neural: `T${n} spinal nerve exits below T${n} and continues as an intercostal nerve.`,
      dental: "Thoracic kyphosis and rib-cage position influence seated balance, scapular support, breathing, and compensatory cervical posture.",
      interaction: "A functional motion segment combines the disc, two facet joints, costovertebral joints, costotransverse joints, and associated ligaments."
    };
    if (n === 9) return {
      id, region: "Thoracic", pattern: "Lower thoracic transitional vertebra",
      landmarks: "Often has a superior costal demifacet and a variable or absent inferior demifacet; still usually has a transverse costal facet.",
      articulations: "T8 and T10 plus rib 9; facet and rib articulation patterns begin transitioning toward the lower thoracic form.",
      movement: "Rotation remains possible, with gradually increasing flexion–extension toward the thoracolumbar junction.",
      neural: "T9 nerve exits below T9 as the ninth thoracic spinal/intercostal nerve.",
      dental: "Supports the lower thorax and breathing mechanics relevant to prolonged seated posture and medically compromised patients.",
      interaction: "Bridges typical double-demifacet thoracic levels and the single-facet pattern below."
    };
    if (n === 10) return {
      id, region: "Thoracic", pattern: "Atypical lower thoracic vertebra",
      landmarks: "Usually a single complete costal facet on each side of the body/pedicle for rib 10; transverse costal facets are generally present.",
      articulations: "T9 and T11, plus the head and tubercle of rib 10.",
      movement: "Moderate transition toward flexion–extension while retaining thoracic rotation and rib stabilization.",
      neural: "T10 nerve exits below T10.",
      dental: "A lower-thoracic postural level; trunk collapse here can drive compensatory forward-head positioning.",
      interaction: "Begins the single-rib/single-vertebral body articulation pattern characteristic of the last ribs."
    };
    const below = n === 11 ? "T12" : "L1";
    return {
      id, region: "Thoracic", pattern: n === 12 ? "Thoracolumbar transition" : "Atypical floating-rib level",
      landmarks: `Single complete costal facet for rib ${n}; no transverse costal facet because ribs 11 and 12 lack tubercles. ${n === 12 ? "Inferior articular facets become lumbar-like and face laterally." : ""}`,
      articulations: `${n === 11 ? "T10" : "T11"} above, ${below} below, and the head of floating rib ${n}.`,
      movement: n === 12 ? "A transition zone: thoracic-style superior facets permit rotation while lumbar-style inferior facets favor flexion–extension." : "Less constrained by the floating rib; permits more flexion–extension than upper thoracic levels.",
      neural: `T${n} nerve exits below T${n}; T12 continues as the subcostal nerve.`,
      dental: "Part of the thoracolumbar support chain that stabilizes an upright dental operator and transfers load to the lumbar spine.",
      interaction: `Transfers load from the rib-bearing thorax toward ${below}; the free anterior end of rib ${n} changes costal mechanics.`
    };
  });
}

function makeLumbarVertebrae(): VertebraRecord[] {
  return Array.from({ length: 5 }, (_, index) => {
    const n = index + 1;
    const id = `L${n}`;
    return {
      id, region: "Lumbar", pattern: n === 5 ? "Lumbosacral transition" : "Typical weight-bearing lumbar vertebra",
      landmarks: `${n === 5 ? "Largest, often wedge-shaped body" : "Large kidney-shaped body"}, triangular vertebral canal, short broad spinous process, mammillary/accessory processes, and sagittally oriented facets${n === 5 ? " with more coronally oriented L5–S1 facets" : ""}.`,
      articulations: `${n === 1 ? "T12" : `L${n - 1}`} above and ${n === 5 ? "S1" : `L${n + 1}`} below through a disc symphysis and paired facet joints.`,
      movement: n === 5 ? "Flexion–extension and limited lateral flexion; facet orientation and the iliolumbar ligaments resist forward shear at L5–S1." : "Sagittal facets favor flexion and extension, allow lateral flexion, and restrict axial rotation.",
      neural: `${id} spinal nerve exits below ${id}. The spinal cord usually ends near L1–L2; lower roots descend as the cauda equina.`,
      dental: "Lumbar lordosis and pelvic position provide the base for neutral thoracic and cervical posture during treatment. Stool and patient positioning should support—not flatten—the normal lumbar curve.",
      interaction: n === 5 ? "Transfers upper-body load across the angled L5–S1 disc to the sacrum and pelvis; this level experiences substantial shear." : "Large bodies bear compressive load while discs absorb shock and paired facets guide motion."
    };
  });
}

function makeSacralVertebrae(): VertebraRecord[] {
  return Array.from({ length: 5 }, (_, index) => {
    const n = index + 1;
    const id = `S${n}`;
    return {
      id, region: "Sacral", pattern: "Fused sacral segment",
      landmarks: n === 1 ? "Sacral promontory, alae, broad base, superior articular processes, and the first anterior/posterior sacral foramina." : n <= 4 ? `Fused body line and level-${n} anterior/posterior sacral foramina; contributes to the median, intermediate, and lateral sacral crests.` : "Inferior sacral apex; lamina non-fusion contributes to the sacral hiatus and sacral cornua.",
      articulations: n === 1 ? "L5 above at the L5–S1 disc and facets; the upper sacrum also contributes to the sacroiliac articulation with each ilium." : n <= 3 ? "Fused to adjacent sacral segments and contributes to the sacroiliac load-transfer region." : n === 4 ? "Fused to S3 and S5; inferior canal narrows toward the hiatus." : "Fused to S4 and articulates with Co1 at the sacrococcygeal joint.",
      movement: "No normal movement between fused sacral bodies; small motion occurs at the sacroiliac and sacrococcygeal joints.",
      neural: n <= 4 ? `Anterior and posterior rami of S${n} pass through the corresponding anterior and posterior sacral foramina.` : "S5 roots descend in the sacral canal and emerge inferiorly near the sacral hiatus.",
      dental: "The sacrum sets pelvic inclination and therefore influences the entire seated spinal curve. Stable pelvic support reduces compensatory lumbar and cervical flexion.",
      interaction: n === 1 ? "Receives axial load from L5 and divides it through the sacral alae into both sacroiliac joints." : "Functions as part of one fused wedge that transfers spinal load into the pelvic ring."
    };
  });
}

function makeCoccygealVertebrae(): VertebraRecord[] {
  return Array.from({ length: 4 }, (_, index) => {
    const n = index + 1;
    const id = `Co${n}`;
    return {
      id, region: "Coccygeal", pattern: n === 1 ? "Largest coccygeal segment" : "Rudimentary fused coccygeal segment",
      landmarks: n === 1 ? "Small body with coccygeal cornua and transverse processes; lacks a vertebral arch and canal." : `Small body-like remnant; Co${n} is commonly fused with adjacent coccygeal segments in adults.`,
      articulations: n === 1 ? "S5 at the sacrococcygeal joint and Co2 below." : `${n === 2 ? "Co1" : `Co${n - 1}`} above and ${n === 4 ? "terminal coccygeal apex" : `Co${n + 1}`} below, usually by fusion in adults.`,
      movement: n === 1 ? "Small flexion–extension may occur at the sacrococcygeal joint." : "Minimal or absent independent motion after fusion.",
      neural: "No spinal cord lies within the coccyx; the coccygeal nerve and terminal filum are nearby superiorly.",
      dental: "Not a direct dental landmark, but coccygeal and pelvic comfort affect stable seated posture during long procedures.",
      interaction: "Provides attachment for pelvic-floor muscles and ligaments and completes the inferior axial skeleton."
    };
  });
}

const vertebrae: VertebraRecord[] = [
  ...cervicalVertebrae,
  ...makeThoracicVertebrae(),
  ...makeLumbarVertebrae(),
  ...makeSacralVertebrae(),
  ...makeCoccygealVertebrae(),
];

type BoneRecord = {
  id: string;
  name: string;
  region: string;
  division: "Axial" | "Appendicular";
  count: number;
  landmarks: string;
  articulations: string;
  function: string;
  dental: string;
};

const sharedLimbDental = "Connect this bone to operator posture, instrument control, patient transfers, positioning, and recognition of musculoskeletal limitations during care.";

const boneAtlas: BoneRecord[] = [
  { id: "frontal", name: "Frontal bone", region: "Skull", division: "Axial", count: 1, landmarks: "Frontal squama, orbital plates, supraorbital margins and foramina, frontal sinus, glabella, and zygomatic processes.", articulations: "Parietal, sphenoid, ethmoid, nasal, maxilla, lacrimal, and zygomatic bones.", function: "Forms the forehead, orbital roofs, and anterior cranial fossa; protects frontal lobes and supports the face.", dental: "Orient the orbit, frontal sinus, anterior cranial fossa, and supraorbital neurovascular exit on head-and-neck imaging." },
  { id: "parietal", name: "Parietal bones", region: "Skull", division: "Axial", count: 2, landmarks: "Parietal eminence, superior and inferior temporal lines, grooves for middle meningeal vessels, and four sutural borders.", articulations: "Opposite parietal, frontal, occipital, temporal, and sphenoid bones.", function: "Form most of the cranial vault and protect the cerebral hemispheres.", dental: "Provides cranial orientation for cephalometry, trauma review, and temporal-fossa relationships." },
  { id: "temporal", name: "Temporal bones", region: "Skull", division: "Axial", count: 2, landmarks: "Squamous, petrous, mastoid, and tympanic parts; zygomatic process, mandibular fossa, articular eminence, styloid and mastoid processes, carotid canal, and internal acoustic meatus.", articulations: "Parietal, occipital, sphenoid, zygomatic, and mandible at the temporomandibular joint.", function: "Houses hearing and balance organs, contributes to the cranial base and arch, and forms the bony part of the TMJ.", dental: "Central to TMJ anatomy, facial-nerve and carotid pathways, mastoid landmarks, and interpretation of panoramic and CBCT images." },
  { id: "occipital", name: "Occipital bone", region: "Skull", division: "Axial", count: 1, landmarks: "Foramen magnum, occipital condyles, hypoglossal canals, external occipital protuberance, nuchal lines, and clivus contribution.", articulations: "Parietal, temporal, sphenoid, and atlas (C1).", function: "Forms the posterior cranial vault and base, protects the cerebellum and brainstem, and transfers skull weight to C1.", dental: "Relates head-rest position to the occiput–C1 joint and helps orient the posterior cranial base on imaging." },
  { id: "sphenoid", name: "Sphenoid bone", region: "Skull", division: "Axial", count: 1, landmarks: "Body and sphenoid sinus, sella turcica, greater and lesser wings, pterygoid processes, optic canals, superior orbital fissures, and foramina rotundum, ovale, and spinosum.", articulations: "All other cranial bones plus zygomatic, palatine, and vomer; acts as a central cranial-base keystone.", function: "Links cranial and facial skeletons, supports the pituitary, forms orbit and cranial fossae, and transmits major nerves and vessels.", dental: "Essential for tracing V2 through foramen rotundum, V3 through foramen ovale, maxillary-artery relations, and pterygoid muscle attachments." },
  { id: "ethmoid", name: "Ethmoid bone", region: "Skull", division: "Axial", count: 1, landmarks: "Cribriform plate, crista galli, perpendicular plate, ethmoidal labyrinths, superior and middle nasal conchae, and ethmoidal air cells.", articulations: "Frontal, sphenoid, vomer, nasal, maxilla, lacrimal, palatine, and inferior nasal conchae.", function: "Forms the nasal roof and septum, medial orbital walls, and olfactory passageways.", dental: "Connects nasal-cavity anatomy, olfaction, ethmoidal sinuses, orbit, and superior pathways of infection spread." },
  { id: "maxilla", name: "Maxillae", region: "Skull", division: "Axial", count: 2, landmarks: "Body and maxillary sinus; frontal, zygomatic, alveolar, and palatine processes; infraorbital foramen; incisive canal; canine fossa and tuberosity.", articulations: "Frontal, ethmoid, nasal, lacrimal, zygomatic, palatine, inferior nasal concha, vomer, and opposite maxilla; holds maxillary teeth.", function: "Forms the upper jaw, anterior hard palate, orbital floor, lateral nasal wall, and support for maxillary dentition.", dental: "Critical for local anesthesia, sinus-root relationships, implants, extractions, cleft anatomy, midface trauma, and CBCT interpretation." },
  { id: "mandible", name: "Mandible", region: "Skull", division: "Axial", count: 1, landmarks: "Body, ramus, angle, symphysis, mental protuberance and foramen, mandibular foramen and canal, lingula, mylohyoid line, condylar and coronoid processes.", articulations: "Paired temporal bones at the TMJs; supports mandibular teeth through its alveolar process.", function: "Forms the movable lower jaw, transmits masticatory load, and anchors muscles of mastication, tongue, floor of mouth, and facial expression.", dental: "Foundational for inferior alveolar and mental anesthesia, extraction and implant risk, TMJ mechanics, fracture patterns, and panoramic/CBCT anatomy." },
  { id: "zygomatic", name: "Zygomatic bones", region: "Skull", division: "Axial", count: 2, landmarks: "Frontal, temporal, and maxillary processes; orbital surface; zygomaticofacial and zygomaticotemporal foramina.", articulations: "Frontal, sphenoid, temporal, and maxilla.", function: "Forms the cheek prominence, lateral orbital wall and floor, and part of the zygomatic arch.", dental: "Orient midface contour, zygomatic buttress, orbit, masseter origin, trauma patterns, and posterior maxillary imaging." },
  { id: "nasal", name: "Nasal bones", region: "Skull", division: "Axial", count: 2, landmarks: "Small paired plates forming the bridge of the nose, with superior, inferior, medial, and lateral borders.", articulations: "Frontal, ethmoid, maxilla, and opposite nasal bone.", function: "Supports the upper external nose and contributes to the roof of the anterior nasal aperture.", dental: "Useful in facial examination, trauma orientation, nasomaxillary relationships, and cephalometric landmarks." },
  { id: "lacrimal", name: "Lacrimal bones", region: "Skull", division: "Axial", count: 2, landmarks: "Lacrimal groove and posterior lacrimal crest on the smallest facial bone.", articulations: "Frontal, ethmoid, maxilla, and inferior nasal concha.", function: "Forms part of the medial orbit and lacrimal fossa for tear drainage.", dental: "Links the orbit, nasal cavity, and nasolacrimal drainage pathway in facial anatomy and imaging." },
  { id: "palatine", name: "Palatine bones", region: "Skull", division: "Axial", count: 2, landmarks: "Horizontal and perpendicular plates, pyramidal process, greater and lesser palatine foramina, and sphenopalatine notch.", articulations: "Maxilla, sphenoid, ethmoid, inferior nasal concha, vomer, and opposite palatine bone.", function: "Forms the posterior hard palate, lateral nasal wall, and small parts of the orbit and pterygopalatine fossa.", dental: "Essential for greater and lesser palatine anesthesia, palatal surgery, nasal relations, and pterygopalatine pathways." },
  { id: "inferior-concha", name: "Inferior nasal conchae", region: "Skull", division: "Axial", count: 2, landmarks: "Curved lamina with lacrimal, ethmoidal, and maxillary processes projecting from the lateral nasal wall.", articulations: "Maxilla, lacrimal, ethmoid, and palatine bones.", function: "Increases nasal surface area and creates the inferior meatus for conditioning inspired air.", dental: "Supports understanding of nasal airflow, inferior-meatus anatomy, and the nasolacrimal duct opening." },
  { id: "vomer", name: "Vomer", region: "Skull", division: "Axial", count: 1, landmarks: "Thin plow-shaped plate with superior alae and a free posterior border.", articulations: "Sphenoid, ethmoid, maxillae, and palatine bones; joins septal cartilage anteriorly.", function: "Forms the posteroinferior bony nasal septum.", dental: "Helps orient the nasal septum, hard palate, choanae, and midline on maxillofacial imaging." },
  { id: "malleus", name: "Mallei", region: "Auditory & hyoid", division: "Axial", count: 2, landmarks: "Head, neck, manubrium, and anterior and lateral processes.", articulations: "Incus at a synovial joint; manubrium attaches to the tympanic membrane.", function: "Transfers tympanic-membrane vibration to the incus.", dental: "Provides context for temporal-bone anatomy and differentiating otologic from referred craniofacial symptoms." },
  { id: "incus", name: "Incudes", region: "Auditory & hyoid", division: "Axial", count: 2, landmarks: "Body with short and long limbs and a lenticular process.", articulations: "Malleus and stapes.", function: "Relays and mechanically transforms sound vibration through the middle ear.", dental: "Supports temporal-bone and ear relationships relevant to craniofacial pain history." },
  { id: "stapes", name: "Stapedes", region: "Auditory & hyoid", division: "Axial", count: 2, landmarks: "Head, neck, anterior and posterior crura, and footplate.", articulations: "Incus; footplate occupies the oval window.", function: "Transmits ossicular vibration into inner-ear fluid.", dental: "Completes the middle-ear chain adjacent to the cranial base and facial-nerve course." },
  { id: "hyoid", name: "Hyoid bone", region: "Auditory & hyoid", division: "Axial", count: 1, landmarks: "Body, greater cornua, and lesser cornua; typically near the C3 level.", articulations: "No direct bony articulation; suspended by muscles and stylohyoid ligaments.", function: "Provides a mobile anchor for tongue, suprahyoid, infrahyoid, pharyngeal, and laryngeal functions.", dental: "Central to swallowing, tongue position, airway assessment, floor-of-mouth anatomy, and cephalometric interpretation." },
  { id: "cervical-group", name: "Cervical vertebrae C1–C7", region: "Vertebral column", division: "Axial", count: 7, landmarks: "Atlas, axis and five subaxial vertebrae; transverse foramina, uncinate processes, and a generally lordotic regional curve.", articulations: "Occiput above, thoracic column below, intervertebral discs from C2–C7, paired facets, and specialized C1–C2 joints.", function: "Supports and positions the head while protecting the cord and permitting substantial flexion, extension, rotation, and lateral flexion.", dental: "Directly affects head-rest positioning, airway alignment, cervical pain, vertebral-artery relations, and operator posture. Use the individual level selector below." },
  { id: "thoracic-group", name: "Thoracic vertebrae T1–T12", region: "Vertebral column", division: "Axial", count: 12, landmarks: "Costal facets, long inferiorly directed spinous processes, relatively circular canals, and a kyphotic regional curve.", articulations: "C7 above, L1 below, discs and facets at adjacent levels, and ribs at costovertebral and costotransverse joints.", function: "Supports the thoracic cage, protects the cord, and favors rotation while limiting flexion and extension.", dental: "Thoracic posture changes scapular and cervical position, breathing mechanics, and sustained operator loading." },
  { id: "lumbar-group", name: "Lumbar vertebrae L1–L5", region: "Vertebral column", division: "Axial", count: 5, landmarks: "Large kidney-shaped bodies, triangular canals, short broad spinous processes, and mammillary and accessory processes.", articulations: "T12 above, sacrum below, with thick discs and predominantly sagittal facets.", function: "Carries large axial loads and permits flexion and extension while limiting rotation.", dental: "Lumbar support and pelvic position determine whether the operator can maintain a neutral thoracic and cervical posture." },
  { id: "sacrum", name: "Sacrum", region: "Vertebral column", division: "Axial", count: 1, landmarks: "Five fused segments, promontory, ala, sacral canal and hiatus, anterior and posterior foramina, auricular surfaces, and median/intermediate/lateral crests.", articulations: "L5, coccyx, and both hip bones at the sacroiliac joints.", function: "Transfers trunk weight into the pelvic girdle and forms the posterior pelvic wall.", dental: "Provides the base for stable seated posture; sacropelvic position influences lumbar, thoracic, and cervical alignment." },
  { id: "coccyx", name: "Coccyx", region: "Vertebral column", division: "Axial", count: 1, landmarks: "Usually four fused rudimentary segments with coccygeal cornua on Co1.", articulations: "Sacrum at the sacrococcygeal joint.", function: "Anchors pelvic-floor muscles and ligaments and supports load in some seated positions.", dental: "Patient and operator seating comfort can influence posture during long appointments." },
  { id: "sternum", name: "Sternum", region: "Thoracic cage", division: "Axial", count: 1, landmarks: "Manubrium, jugular and clavicular notches, sternal angle, body, and xiphoid process.", articulations: "Clavicles and costal cartilages of ribs 1–7 directly; rib 2 aligns with the sternal angle.", function: "Protects mediastinal structures and anchors ribs and pectoral-girdle structures.", dental: "Surface landmarks support cardiopulmonary examination and emergency orientation." },
  { id: "ribs", name: "Ribs 1–12", region: "Thoracic cage", division: "Axial", count: 24, landmarks: "Head, neck, tubercle, angle, shaft, costal groove; ribs 1–7 true, 8–10 false, and 11–12 floating.", articulations: "Thoracic vertebral bodies and transverse processes; anteriorly through costal cartilage according to rib class.", function: "Protect thoracic organs and change thoracic dimensions during ventilation.", dental: "Connects respiratory mechanics, patient positioning, chest observation, and thoracic posture." },
  { id: "clavicle", name: "Clavicles", region: "Pectoral girdle", division: "Appendicular", count: 2, landmarks: "Sternal and acromial ends, conoid tubercle, trapezoid line, and subclavian groove.", articulations: "Sternum at the sternoclavicular joint and scapular acromion at the acromioclavicular joint.", function: "Acts as a strut holding the shoulder laterally and transmits upper-limb forces to the axial skeleton.", dental: "Shoulder position and clavicular elevation affect neck loading and working posture." },
  { id: "scapula", name: "Scapulae", region: "Pectoral girdle", division: "Appendicular", count: 2, landmarks: "Spine, acromion, coracoid, glenoid cavity, supraspinous/infraspinous/subscapular fossae, borders, and angles.", articulations: "Humerus at the glenohumeral joint and clavicle at the acromioclavicular joint; glides functionally on the thoracic wall.", function: "Positions the glenoid and provides broad muscle attachments for shoulder and arm control.", dental: "Scapular stability is central to reducing neck and shoulder fatigue during fine dental work." },
  { id: "humerus", name: "Humeri", region: "Upper limb", division: "Appendicular", count: 2, landmarks: "Head, anatomic/surgical necks, greater and lesser tubercles, deltoid tuberosity, radial groove, capitulum, trochlea, epicondyles, and fossae.", articulations: "Scapula proximally; radius and ulna distally.", function: "Forms the arm lever and supports wide shoulder motion plus elbow flexion and extension.", dental: sharedLimbDental },
  { id: "radius", name: "Radii", region: "Upper limb", division: "Appendicular", count: 2, landmarks: "Head, neck, radial tuberosity, interosseous border, ulnar notch, styloid process, and dorsal tubercle.", articulations: "Humerus, ulna proximally and distally, scaphoid, and lunate.", function: "Rotates around the ulna in pronation/supination and transmits much of the wrist load to the elbow.", dental: sharedLimbDental },
  { id: "ulna", name: "Ulnae", region: "Upper limb", division: "Appendicular", count: 2, landmarks: "Olecranon, coronoid process, trochlear and radial notches, ulnar tuberosity, head, and styloid process.", articulations: "Humerus and radius; separated from direct carpal contact by the articular disc.", function: "Provides the primary hinge relationship at the elbow and stabilizes forearm rotation.", dental: sharedLimbDental },
  ...[
    ["scaphoid", "Scaphoids", "Proximal radial carpal; tubercle and waist.", "Radius, lunate, capitate, trapezium, and trapezoid."],
    ["lunate", "Lunates", "Crescent-shaped proximal central carpal.", "Radius, scaphoid, triquetrum, capitate, and hamate."],
    ["triquetrum", "Triquetra", "Pyramidal proximal ulnar carpal.", "Lunate, hamate, and pisiform; indirectly related to the articular disc."],
    ["pisiform", "Pisiforms", "Sesamoid carpal within flexor carpi ulnaris.", "Triquetrum only."],
    ["trapezium", "Trapezia", "Distal radial carpal with a saddle surface and tubercle.", "Scaphoid, trapezoid, and metacarpals I–II."],
    ["trapezoid", "Trapezoids", "Small wedge-shaped distal carpal.", "Scaphoid, trapezium, capitate, and metacarpal II."],
    ["capitate", "Capitates", "Largest central carpal with rounded head.", "Scaphoid, lunate, trapezoid, hamate, and metacarpals II–IV."],
    ["hamate", "Hamates", "Distal ulnar carpal with a palmar hook.", "Lunate, triquetrum, capitate, and metacarpals IV–V."],
  ].map(([id, name, landmarks, articulations]) => ({ id, name, region: "Upper limb", division: "Appendicular" as const, count: 2, landmarks, articulations, function: "Contributes to the carpal arch, wrist mobility, and transmission of forces between hand and forearm.", dental: "Carpal stability and wrist position affect precision grip, tactile control, and risk of repetitive strain during instrumentation." })),
  { id: "metacarpals", name: "Metacarpals I–V", region: "Upper limb", division: "Appendicular", count: 10, landmarks: "Each has a base, shaft, and head; the first is short and mobile, while the second and third form a stable central pillar.", articulations: "Distal carpals proximally and proximal phalanges distally; adjacent bases articulate variably.", function: "Forms the palm, balances stability with cupping, and positions the digits for power and precision grips.", dental: "Metacarpal control supports modified pen grasp, fulcrum stability, and fine instrument movement." },
  { id: "hand-phalanges", name: "Hand phalanges", region: "Upper limb", division: "Appendicular", count: 28, landmarks: "Proximal, middle, and distal phalanges with bases, shafts, and heads; each thumb lacks a middle phalanx.", articulations: "Metacarpals at MCP joints and adjacent phalanges at IP joints.", function: "Produces digit positioning, opposition-assisted pinch, precision grip, and tactile manipulation.", dental: "Directly responsible for instrument grasp, finger rests, controlled stroke generation, and tactile sensitivity." },
  { id: "hip-bone", name: "Hip bones", region: "Pelvic girdle", division: "Appendicular", count: 2, landmarks: "Fused ilium, ischium, and pubis; acetabulum, obturator foramen, iliac crest, ASIS, ischial spine and tuberosity, pubic symphyseal surface.", articulations: "Sacrum, opposite hip bone at the pubic symphysis, and femoral head.", function: "Transfers trunk weight to the lower limbs, protects pelvic viscera, and anchors trunk and limb muscles.", dental: "Pelvic position establishes the seated base that determines lumbar support and upper-body posture." },
  { id: "femur", name: "Femora", region: "Lower limb", division: "Appendicular", count: 2, landmarks: "Head and fovea, neck, greater and lesser trochanters, linea aspera, condyles, epicondyles, and intercondylar fossa.", articulations: "Hip bone at the acetabulum, tibia at the knee, and patella anteriorly.", function: "Transfers body weight through the thigh and provides long lever arms for locomotion.", dental: sharedLimbDental },
  { id: "patella", name: "Patellae", region: "Lower limb", division: "Appendicular", count: 2, landmarks: "Base, apex, anterior surface, and medial and lateral posterior articular facets.", articulations: "Femoral trochlear surface.", function: "Increases quadriceps leverage and protects the anterior knee.", dental: sharedLimbDental },
  { id: "tibia", name: "Tibiae", region: "Lower limb", division: "Appendicular", count: 2, landmarks: "Medial/lateral condyles, intercondylar eminence, tibial tuberosity, anterior crest, soleal line, fibular notch, and medial malleolus.", articulations: "Femur, fibula proximally and distally, and talus.", function: "Primary weight-bearing bone of the leg and a major stabilizer of knee and ankle.", dental: sharedLimbDental },
  { id: "fibula", name: "Fibulae", region: "Lower limb", division: "Appendicular", count: 2, landmarks: "Head, neck, shaft, interosseous border, and lateral malleolus.", articulations: "Tibia proximally and distally and talus at the ankle; does not articulate with the femur.", function: "Stabilizes the ankle and provides muscle attachment while carrying limited axial load.", dental: sharedLimbDental },
  ...[
    ["talus", "Tali", "Body, neck, head, trochlea, and posterior process.", "Tibia, fibula, calcaneus, and navicular."],
    ["calcaneus", "Calcanei", "Calcaneal tuberosity, sustentaculum tali, peroneal trochlea, and talar facets.", "Talus and cuboid."],
    ["navicular", "Naviculars", "Concave proximal surface and medial tuberosity.", "Talus and the three cuneiforms; often cuboid."],
    ["cuboid", "Cuboids", "Groove for fibularis longus and plantar tuberosity.", "Calcaneus, lateral cuneiform, navicular, and metatarsals IV–V."],
    ["medial-cuneiform", "Medial cuneiforms", "Largest cuneiform with a broad plantar base.", "Navicular, intermediate cuneiform, and metatarsals I–II."],
    ["intermediate-cuneiform", "Intermediate cuneiforms", "Small wedge with a narrow dorsal base.", "Navicular, medial/lateral cuneiforms, and metatarsal II."],
    ["lateral-cuneiform", "Lateral cuneiforms", "Wedge-shaped lateral member of the cuneiform row.", "Navicular, intermediate cuneiform, cuboid, and metatarsals II–IV."],
  ].map(([id, name, landmarks, articulations]) => ({ id, name, region: "Lower limb", division: "Appendicular" as const, count: 2, landmarks, articulations, function: "Contributes to the hindfoot or midfoot arches, load transfer, balance, and adaptation to the ground.", dental: "Foot support and balanced loading provide the stable base required for neutral seated or standing clinical posture." })),
  { id: "metatarsals", name: "Metatarsals I–V", region: "Lower limb", division: "Appendicular", count: 10, landmarks: "Bases, shafts, and heads; first is robust, fifth has a prominent tuberosity.", articulations: "Tarsal bones proximally, proximal phalanges distally, and adjacent metatarsal bases.", function: "Forms the forefoot and supports longitudinal and transverse arches during stance and propulsion.", dental: "Balanced forefoot support helps maintain a stable operator base and reduces compensatory spinal posture." },
  { id: "foot-phalanges", name: "Foot phalanges", region: "Lower limb", division: "Appendicular", count: 28, landmarks: "Proximal, middle, and distal phalanges; each great toe lacks a middle phalanx.", articulations: "Metatarsals at MTP joints and adjacent phalanges at IP joints.", function: "Supports balance, weight transfer, and propulsion during gait.", dental: "Toe support contributes to balance during standing care and to a stable seated foot position." },
];

const toothTissueModel: Model3D = {
  uid: "9cc281349c314cc4859e26af238f9cd5",
  title: "Tooth cross-section: enamel, dentin, pulp, and neurovascular bundle",
  creator: "Ebers",
  note: "Use this sectional model for spatial relationships, then use microscopy for cellular detail.",
};

function modelForTooth(tooth: Tooth): Model3D {
  const arch = tooth.name.startsWith("Maxillary") ? "maxillary" : "mandibular";
  return toothModels[`${arch}${tooth.fdi % 10}`];
}

export default function Home() {
  const teeth = useMemo(() => makeTeeth(), []);
  const [module, setModule] = useState("dentition");
  const [selected, setSelected] = useState(teeth[2]);
  const [quiz, setQuiz] = useState(false);
  const [answer, setAnswer] = useState<null | boolean>(null);

  const title = modules.find((m) => m.id === module)?.label ?? "Dental anatomy";

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => { setModule("dentition"); setQuiz(false); }}>
          <span className="brandMark">D</span>
          <span><b>Dental Atlas</b><small>Interactive study lab</small></span>
        </button>
        <nav>
          <button
            className={!quiz && module !== "histology" ? "active" : ""}
            aria-pressed={!quiz && module !== "histology"}
            onClick={() => { setQuiz(false); setModule("dentition"); }}
          >Explore</button>
          <button
            className={!quiz && module === "histology" ? "active" : ""}
            aria-pressed={!quiz && module === "histology"}
            onClick={() => { setQuiz(false); setModule("histology"); }}
          >Study</button>
          <button
            className={quiz ? "active" : ""}
            aria-pressed={quiz}
            onClick={() => { setQuiz(true); setAnswer(null); }}
          >Quiz</button>
        </nav>
        <div className="educationBadge"><b>Learning atlas</b><span>Models · visuals · definitions · functions</span></div>
      </header>

      <div className="appShell">
        <aside className="moduleRail">
          <p>LIBRARY</p>
          {modules.map((m) => (
            <button key={m.id} className={module === m.id && !quiz ? "selected" : ""} onClick={() => { setModule(m.id); setQuiz(false); }}>
              <span>{m.icon}</span><b>{m.label}</b><small>{m.count}</small>
            </button>
          ))}
          <div className="railNote"><b>Study tip</b><span>Rotate every model through facial, lingual, mesial, distal, and occlusal views before reading the recognition notes.</span></div>
          <button className="referenceJump" onClick={() => document.getElementById("references")?.scrollIntoView({ behavior: "smooth" })}>Sources & scope</button>
        </aside>

        <section className="workspace">
          <div className="crumbs">Atlas / <b>{quiz ? "Quiz mode" : title}</b></div>
          {quiz ? (
            <Quiz answer={answer} setAnswer={setAnswer} />
          ) : module === "dentition" ? (
            <DentalViewer teeth={teeth} selected={selected} setSelected={setSelected} />
          ) : module === "body" || module === "head" ? (
            <BodyAtlas headOnly={module === "head"} />
          ) : module === "skeleton" ? (
            <SkeletonAtlas />
          ) : module === "library" ? (
            <AnatomyLibrary />
          ) : module === "histology" ? (
            <Histology />
          ) : (
            <Pathology />
          )}
          <References />
        </section>
      </div>
    </main>
  );
}

function DentalViewer({ teeth, selected, setSelected }: { teeth: Tooth[]; selected: Tooth; setSelected: (tooth: Tooth) => void }) {
  const [archModelIndex, setArchModelIndex] = useState(0);
  const [isolated, setIsolated] = useState(false);
  const isolatedModel = modelForTooth(selected);
  const model = isolated ? isolatedModel : fullArchModels[archModelIndex];
  return (
    <div className="dentitionPage">
      <div className="viewerGrid">
        <section className="viewerCard archViewer">
          <div className="viewerHeading">
            <div>
              <span className="selectedPill">COMPLETE DENTITION LAB</span>
              <h1>{isolated ? `Isolated morphology · Tooth ${selected.universal}` : "Full arches, occlusion & supporting anatomy"}</h1>
              <p>{isolated ? selected.name : "Upper and lower arches together · 32 teeth · jaws · eruption · function"}</p>
            </div>
            <span className="liveDot">{isolated ? "Single-tooth view" : "Full-arch view"}</span>
          </div>
          <ModelFrame model={model} label={isolated ? `FDI ${selected.fdi} · Universal ${selected.universal}` : model.title} originalPreset={isolated ? "tooth" : "dentition"} />
          <div className="modelTabs archModelTabs" aria-label="Complete dentition model views">
            {fullArchModels.map((m, i) => (
              <button key={m.uid} className={!isolated && archModelIndex === i ? "on" : ""} onClick={() => { setArchModelIndex(i); setIsolated(false); }}>{m.title}</button>
            ))}
            {isolated && <button className="on" onClick={() => setIsolated(true)}>Tooth {selected.universal} isolated</button>}
          </div>
        <div className="odontogram">
            <div><b>Clickable complete permanent dentition</b><span>Universal number · FDI number</span></div>
          <div className="odontoRows">
              <div>{teeth.slice(0, 16).map((tooth: Tooth) => <button key={tooth.fdi} aria-label={`Odontogram tooth ${tooth.universal} FDI ${tooth.fdi}`} className={selected.fdi === tooth.fdi ? "on" : ""} onClick={() => setSelected(tooth)}><b>{tooth.universal}</b><small>{tooth.fdi}</small></button>)}</div>
              <div>{teeth.slice(16).map((tooth: Tooth) => <button key={tooth.fdi} aria-label={`Odontogram tooth ${tooth.universal} FDI ${tooth.fdi}`} className={selected.fdi === tooth.fdi ? "on" : ""} onClick={() => setSelected(tooth)}><b>{tooth.universal}</b><small>{tooth.fdi}</small></button>)}</div>
          </div>
            <p className="modelCaveat">Select a tooth to update the learning panel without leaving the complete arch. Use “Isolate selected tooth” only when you want close morphology. Natural anatomy and occlusion vary.</p>
        </div>
        </section>
        <aside className="detailPanel">
          <span className="selectedPill">● SELECTED IN THE ARCH</span>
          <h2>Tooth {selected.universal}</h2>
          <p>{selected.name}</p>
          <div className="toothGlyph"><img src={`${publicBasePath}/atlas/tooth-cross-section.webp`} alt="Schematic cross-section of a tooth and periodontal tissues" /><span>FDI {selected.fdi}</span></div>
          <LearningBlock label="Definition" text={selected.definition} />
          <LearningBlock label="Primary functions" text={selected.function} />
          <dl>
            <div><dt>Class</dt><dd>{selected.type}</dd></div>
            <div><dt>Roots</dt><dd>{selected.roots}</dd></div>
            <div><dt>Cusps</dt><dd>{selected.cusps}</dd></div>
            <div><dt>Eruption</dt><dd>{selected.eruption}</dd></div>
          </dl>
          <LearningBlock label="Recognition" text={selected.recognition} />
          <div className="clinicalPearl"><b>Identification pearl</b><p>{selected.pearl}</p></div>
          <button className="sourceButton isolateButton" onClick={() => setIsolated(!isolated)}>{isolated ? "Return to complete arches" : "Isolate selected tooth"}</button>
        </aside>
      </div>

      <section className="archCurriculum">
        <div className="sectionHeading">
          <span className="selectedPill">ARCH-LEVEL ANATOMY</span>
          <h2>Study the dentition as one functional system</h2>
          <p>Individual tooth morphology remains available, but the primary view now preserves position, contacts, antagonists, supporting tissues, and jaw relationships.</p>
        </div>
        <div className="archConceptGrid">
          <article><span>01 · ARCH FORM</span><h3>Maxillary and mandibular geometry</h3><p>Compare arch width, length, curvature, symmetry, midlines, tooth inclinations, and the larger maxillary arch that overlaps the mandibular arch in typical occlusion.</p></article>
          <article><span>02 · CONTACTS</span><h3>Proximal and occlusal relationships</h3><p>Trace contact areas, embrasures, marginal-ridge levels, buccal/lingual corridors, supporting cusps, guiding cusps, and each tooth’s usual antagonists.</p></article>
          <article><span>03 · OCCLUSION</span><h3>Static and functional organization</h3><p>Orient overjet, overbite, Angle molar/canine relationships, curves of Spee and Wilson, maximum intercuspation, centric relation, anterior guidance, and excursive contacts.</p></article>
          <article><span>04 · SUPPORT</span><h3>Periodontium and load transfer</h3><p>Connect enamel, dentin, pulp, cementum, periodontal ligament, alveolar bone, gingiva, contact areas, and root form to force direction and periodontal protection.</p></article>
          <article><span>05 · DEVELOPMENT</span><h3>Primary, mixed, and permanent dentitions</h3><p>Review 20 primary teeth, 32 permanent teeth, succedaneous versus nonsuccedaneous teeth, eruption sequence, leeway space, primate spaces, and physiologic root resorption.</p></article>
          <article><span>06 · CLINICAL VIEWS</span><h3>Five views plus radiographic anatomy</h3><p>Rotate through facial, lingual/palatal, mesial, distal, and occlusal/incisal views, then correlate crown and root morphology with periapical, bitewing, panoramic, and CBCT appearances.</p></article>
        </div>
      </section>
    </div>
  );
}

function LearningBlock({ label, text }: { label: string; text: string }) {
  return <div className="learningBlock"><b>{label}</b><p>{text}</p></div>;
}

function inferOriginalPreset(model: Model3D, label?: string): AnatomyPreset {
  const text = `${model.title} ${label ?? ""}`.toLowerCase();
  if (/dentition|occlusion|eruption|maxilla and mandible|orofacial/.test(text)) return "dentition";
  if (/tooth|molar|incisor|canine|premolar|pulp|endodont/.test(text)) return /section|pulp|endodont|histolog/.test(text) ? "tissue" : "tooth";
  if (/vertebr|spine|cervical|thoracic|lumbar|sacral|atlas|axis/.test(text)) return "spine";
  if (/head|neck|skull|crani|facial|mandible|maxilla|oral cavity|pharynx/.test(text)) return "head";
  if (/skeleton|osteology|bone/.test(text)) return "skeleton";
  if (/histolog|tissue|periodont/.test(text)) return "tissue";
  return "body";
}

function ModelFrame({ model, label, originalPreset }: { model: Model3D; label?: string; originalPreset?: AnatomyPreset }) {
  const preset = originalPreset ?? inferOriginalPreset(model, label);

  return <div className="modelStage">
    <div className="clinicalModelBanner">
      <div>
        <span>PRIMARY STUDY MODEL</span>
        <b>{preset === "dentition" ? "CT-derived complete permanent dentition" : model.title}</b>
      </div>
      <small>Rotate · zoom · pan · double-click to focus · fullscreen for close study</small>
    </div>
    <iframe
      key={model.uid}
      title={model.title}
      src={`https://sketchfab.com/models/${model.uid}/embed?autostart=1&preload=1&ui_theme=dark&dnt=1&ui_infos=0&ui_annotations=1&ui_inspector=1&ui_controls=1&ui_fullscreen=1&ui_help=1`}
      allow="autoplay; fullscreen; xr-spatial-tracking"
      loading="eager"
      allowFullScreen
    />
    <div className="modelMeta">
      <span><b>{label ?? model.title}</b><small>{model.title}</small></span>
      <span className="modelControls">Patient-independent educational specimen · Natural variation exists</span>
    </div>
    <div className="modelCredit">
      <span>Detailed source model: {model.creator}. Hosted by Sketchfab. {model.note}</span>
      <a href={`https://sketchfab.com/3d-models/${model.uid}`} target="_blank" rel="noreferrer">Model source ↗</a>
    </div>
  </div>;
}

function AnatomyLibrary() {
  const [region, setRegion] = useState("All");
  const [system, setSystem] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(anatomyUnits[0].id);
  const regions = ["All", ...Array.from(new Set(anatomyUnits.map((unit) => unit.region)))];
  const systemsList = ["All", ...Array.from(new Set(anatomyUnits.map((unit) => unit.system)))];
  const selected = anatomyUnits.find((unit) => unit.id === selectedId) ?? anatomyUnits[0];
  const filtered = anatomyUnits.filter((unit) => {
    const regionMatch = region === "All" || unit.region === region;
    const systemMatch = system === "All" || unit.system === system;
    const haystack = `${unit.name} ${unit.region} ${unit.system} ${unit.structures} ${unit.dental}`.toLowerCase();
    return regionMatch && systemMatch && haystack.includes(query.trim().toLowerCase());
  });

  return <div className="anatomyLibrary">
    <section className="libraryHero">
      <div>
        <span className="selectedPill">REGION × SYSTEM ATLAS</span>
        <h1>Complete anatomy learning library</h1>
        <p>Gross anatomy, relationships, function, imaging orientation, clinical relevance, and dental integration—organized for fast study rather than passive browsing.</p>
      </div>
      <div className="libraryStats">
        <div><b>28</b><span>core study units</span></div>
        <div><b>8</b><span>body regions</span></div>
        <div><b>13</b><span>systems and disciplines</span></div>
        <div><b>4</b><span>learning layers per unit</span></div>
      </div>
    </section>

    <section className="libraryControls" aria-label="Anatomy library filters">
      <label>
        <span>SEARCH STRUCTURES OR TOPICS</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: trigeminal, airway, liver, brachial plexus…" />
      </label>
      <div>
        <span>REGION</span>
        <div className="filterRow">{regions.map((item) => <button key={item} className={region === item ? "on" : ""} onClick={() => setRegion(item)}>{item}</button>)}</div>
      </div>
      <div>
        <span>SYSTEM</span>
        <div className="filterRow">{systemsList.map((item) => <button key={item} className={system === item ? "on" : ""} onClick={() => setSystem(item)}>{item}</button>)}</div>
      </div>
    </section>

    <section className="anatomyExplorer">
      <aside className="unitCatalog">
        <div className="catalogHeader"><b>{filtered.length} study units</b><span>Click to open</span></div>
        <div className="unitList">
          {filtered.map((unit) => (
            <button key={unit.id} className={selected.id === unit.id ? "on" : ""} onClick={() => setSelectedId(unit.id)}>
              <span>{unit.region} · {unit.system}</span>
              <b>{unit.name}</b>
              <small>{unit.structures}</small>
            </button>
          ))}
          {filtered.length === 0 && <div className="emptyState"><b>No exact match</b><p>Try a broader word or reset a filter.</p></div>}
        </div>
      </aside>

      <article className="unitDetail">
        <div className="unitTitle">
          <span>{selected.region.toUpperCase()} · {selected.system.toUpperCase()}</span>
          <h2>{selected.name}</h2>
        </div>
        <ModelFrame model={selected.model} label={`${selected.region} · ${selected.name}`} />
        <div className="unitLearningGrid">
          <LearningBlock label="Structures included" text={selected.structures} />
          <LearningBlock label="Core functions" text={selected.function} />
          <LearningBlock label="Spatial relationships to master" text={selected.relations} />
          <div className="dentalBlock"><b>Why a dental student needs this</b><p>{selected.dental}</p></div>
        </div>
      </article>
    </section>

    <section className="anatomyDimensions">
      <div className="sectionHeading">
        <span className="selectedPill">EVERY ANATOMICAL ASPECT</span>
        <h2>Twelve complementary ways to learn each region</h2>
        <p>The atlas deliberately connects macroscopic form to microscopic structure, development, imaging, and clinical use.</p>
      </div>
      <div className="dimensionGrid">
        {[
          ["Osteology", "Bones, landmarks, foramina, canals, sutures and load paths."],
          ["Arthrology", "Joint surfaces, capsules, ligaments, axes and movements."],
          ["Myology", "Origin, insertion, action, innervation and functional groups."],
          ["Neuroanatomy", "Central pathways, peripheral nerves, ganglia and autonomics."],
          ["Angiology", "Arteries, veins, anastomoses, pulse points and hemorrhage risk."],
          ["Lymphatics", "Drainage territories, nodes, immune routes and disease spread."],
          ["Splanchnology", "Organ structure, relations, ducts, mesenteries and function."],
          ["Surface anatomy", "Palpable landmarks and the anatomy used during examination."],
          ["Cross-sections", "Axial, coronal and sagittal spatial orientation."],
          ["Imaging", "Periapical, bitewing, panoramic, cephalometric, CT/CBCT and MRI correlation."],
          ["Embryology", "Origins, migrations, fusion, eruption and congenital patterns."],
          ["Histology & pathology", "Cells, tissues, normal architecture and pattern-based change."],
        ].map(([name, text], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{text}</p></article>)}
      </div>
    </section>
  </div>;
}

function SkeletonAtlas() {
  const [selectedId, setSelectedId] = useState("C1");
  const [region, setRegion] = useState("All");
  const [modelIndex, setModelIndex] = useState(0);
  const [selectedBoneId, setSelectedBoneId] = useState("mandible");
  const [boneRegion, setBoneRegion] = useState("All");
  const [boneQuery, setBoneQuery] = useState("");
  const selected = vertebrae.find((v) => v.id === selectedId) ?? vertebrae[0];
  const regions = ["All", "Cervical", "Thoracic", "Lumbar", "Sacral", "Coccygeal"];
  const visible = region === "All" ? vertebrae : vertebrae.filter((v) => v.region === region);
  const selectedBone = boneAtlas.find((bone) => bone.id === selectedBoneId) ?? boneAtlas[0];
  const boneRegions = ["All", ...Array.from(new Set(boneAtlas.map((bone) => bone.region)))];
  const normalizedBoneQuery = boneQuery.trim().toLowerCase();
  const visibleBones = boneAtlas.filter((bone) =>
    (boneRegion === "All" || bone.region === boneRegion) &&
    (!normalizedBoneQuery || `${bone.id} ${bone.name} ${bone.region} ${bone.landmarks}`.toLowerCase().includes(normalizedBoneQuery))
  );
  const accountedBones = boneAtlas.reduce((sum, bone) => sum + bone.count, 0);

  function chooseVertebra(id: string) {
    setSelectedId(id);
    if (id === "C1") setModelIndex(3);
    else if (id === "C2") setModelIndex(4);
    else if (id === "C7") setModelIndex(6);
    else if (/^C[3-6]$/.test(id)) setModelIndex(5);
    else setModelIndex(1);
  }

  return <div className="skeletonPage">
    <section className="skeletonHero">
      <div className="viewerHeading">
        <div><span className="selectedPill">OSTEOLOGY LAB</span><h1>Complete skeleton & vertebral column</h1><p>Whole-body osteology · all 33 vertebral levels · joints · movement · dental relevance</p></div>
        <span className="liveDot">Interactive 3D</span>
      </div>
      <ModelFrame model={skeletonModels[modelIndex]} label={modelIndex === 1 ? `${selected.id} · ${selected.pattern}` : undefined} originalPreset={modelIndex === 0 ? "skeleton" : "spine"} />
      <div className="modelTabs skeletonModelTabs">
        {skeletonModels.map((model, i) => <button key={model.uid} className={modelIndex === i ? "on" : ""} onClick={() => setModelIndex(i)}>{model.title}</button>)}
      </div>
      <div className="skeletonStats">
        <div><b>206</b><span>typical adult bones</span></div>
        <div><b>80</b><span>axial skeleton</span></div>
        <div><b>126</b><span>appendicular skeleton</span></div>
        <div><b>33</b><span>vertebral levels before fusion</span></div>
        <div><b>24</b><span>mobile presacral vertebrae</span></div>
      </div>
    </section>

    <section className="wholeBoneAtlas">
      <div className="sectionHeading">
        <span className="selectedPill">206-BONE EXPLORER</span>
        <h2>Every region of the adult skeleton</h2>
        <p>The catalog accounts for the standard {accountedBones}-bone adult skeleton. Paired and serial bones are grouped for navigation, while the vertebral lab below separates all developmental levels.</p>
      </div>
      <div className="boneAtlasToolbar">
        <label>
          <span>SEARCH BONES OR LANDMARKS</span>
          <input value={boneQuery} onChange={(event) => setBoneQuery(event.target.value)} placeholder="Try mandible, foramen, carpal, talus…" />
        </label>
        <div>
          <span>FILTER BY REGION</span>
          <div className="boneRegionFilters">{boneRegions.map((item) => <button key={item} className={boneRegion === item ? "on" : ""} onClick={() => setBoneRegion(item)}>{item}</button>)}</div>
        </div>
      </div>
      <div className="boneAtlasBody">
        <aside className="boneCatalog" aria-label="Adult skeleton bone catalog">
          <div className="boneCatalogHeader"><b>{visibleBones.length} study entries</b><span>{visibleBones.reduce((sum, bone) => sum + bone.count, 0)} bones represented</span></div>
          <div className="boneCatalogList">
            {visibleBones.length ? visibleBones.map((bone) => <button key={bone.id} className={selectedBone.id === bone.id ? "on" : ""} onClick={() => setSelectedBoneId(bone.id)}>
              <span>{bone.region} · {bone.division}</span>
              <b>{bone.name}</b>
              <small>{bone.count === 1 ? "1 bone" : `${bone.count} bones in the adult skeleton`}</small>
            </button>) : <div className="emptyBoneResults"><b>No matches</b><span>Try another bone, landmark, or region.</span></div>}
          </div>
        </aside>
        <article className="boneStudyCard">
          <div className="boneTitle">
            <div><span>{selectedBone.division.toUpperCase()} · {selectedBone.region.toUpperCase()}</span><h2>{selectedBone.name}</h2></div>
            <div className="boneCountBadge"><b>{selectedBone.count}</b><span>{selectedBone.count === 1 ? "adult bone" : "adult bones"}</span></div>
          </div>
          <div className="boneStudyGrid">
            <LearningBlock label="Recognition landmarks" text={selectedBone.landmarks} />
            <LearningBlock label="Direct articulations" text={selectedBone.articulations} />
            <LearningBlock label="Mechanical role & function" text={selectedBone.function} />
            <div className="dentalBlock"><b>Dental-school connection</b><p>{selectedBone.dental}</p></div>
          </div>
          <div className="countingKey">
            <b>Counting key</b>
            <p>Axial 80 = skull 22 + auditory ossicles 6 + hyoid 1 + adult vertebral column 26 + thoracic cage 25. Appendicular 126 = pectoral girdles 4 + upper limbs 60 + pelvic girdle 2 + lower limbs 60.</p>
          </div>
        </article>
      </div>
    </section>

    <section className="spineLab">
      <aside className="spineNavigator">
        <span className="selectedPill">LEVEL SELECTOR</span>
        <h2>Every vertebral level</h2>
        <p>Select a level to load its relationships and the most useful 3D view.</p>
        <div className="regionFilters">{regions.map((r) => <button key={r} className={region === r ? "on" : ""} onClick={() => setRegion(r)}>{r}</button>)}</div>
        <div className="vertebraButtons">{visible.map((v) => <button key={v.id} className={selected.id === v.id ? `on ${v.region.toLowerCase()}` : v.region.toLowerCase()} onClick={() => chooseVertebra(v.id)}><b>{v.id}</b><small>{v.region}</small></button>)}</div>
        <div className="variationNote"><b>Numbering note</b><p>The standard developmental count is 33: 7 cervical, 12 thoracic, 5 lumbar, 5 sacral, and usually 4 coccygeal. Coccygeal number and fusion vary.</p></div>
      </aside>

      <article className="vertebraDetail">
        <div className="vertebraTitle"><span>{selected.region.toUpperCase()} · SELECTED LEVEL</span><h2>{selected.id}</h2><p>{selected.pattern}</p></div>
        <div className="detailMatrix">
          <LearningBlock label="Recognition landmarks" text={selected.landmarks} />
          <LearningBlock label="Direct articulations" text={selected.articulations} />
          <LearningBlock label="Movement & biomechanics" text={selected.movement} />
          <LearningBlock label="Neural / vascular relationships" text={selected.neural} />
          <LearningBlock label="How the level interacts" text={selected.interaction} />
          <div className="dentalBlock"><b>Dental-school connection</b><p>{selected.dental}</p></div>
        </div>
      </article>
    </section>

    <section className="jointAtlas">
      <div className="sectionHeading"><span className="selectedPill">JOINT INTERACTIONS</span><h2>How the vertebral column moves as a system</h2><p>A vertebra does not move alone. Each motion segment combines bone, disc, facets, ligaments, nerves, and—within the thorax—ribs.</p></div>
      <div className="jointCards">
        <div><b>Occiput–C1</b><span>Paired synovial condyloid joints</span><p>Occipital condyles sit in C1’s superior facets. Primary movement is flexion/extension with limited lateral flexion.</p></div>
        <div><b>C1–C2</b><span>One median + two lateral synovial joints</span><p>The dens is the pivot; C1 and the skull rotate around it. The transverse ligament retains the dens against C1’s anterior arch.</p></div>
        <div><b>C2–C7</b><span>Disc symphysis + paired facet joints</span><p>Each level forms a three-joint complex. Discs transmit load; facets guide coupled rotation, lateral flexion, and flexion/extension.</p></div>
        <div><b>Thoracic + ribs</b><span>Costovertebral and costotransverse joints</span><p>Rib heads meet body facets and rib tubercles meet transverse facets. The cage increases stability and limits flexion/extension.</p></div>
        <div><b>Lumbar column</b><span>Large discs + sagittal facets</span><p>Designed for load and flexion/extension. Facet orientation limits axial rotation and protects against excessive shear.</p></div>
        <div><b>L5–sacrum–pelvis</b><span>Lumbosacral + sacroiliac transfer</span><p>The angled L5–S1 segment transfers axial load into the fused sacrum, then through both sacroiliac joints to the pelvic ring.</p></div>
      </div>
    </section>

    <section className="boneRoadmap">
      <div className="sectionHeading"><span className="selectedPill">FULL-SKELETON ROADMAP</span><h2>What a dental student should prioritize</h2></div>
      <div className="roadmapGrid">
        <div><span>AXIAL · 80</span><h3>Skull, hyoid, spine, ribs, sternum</h3><p>Start with the 22 skull bones, sutures, foramina, cranial base, maxilla, mandible, hyoid, cervical vertebrae, and thoracic cage. These establish the airway, muscle attachments, neurovascular passages, and radiographic orientation.</p></div>
        <div><span>APPENDICULAR · 126</span><h3>Girdles and limbs</h3><p>Know major bones, joint surfaces, and muscle-attachment landmarks. The pectoral girdle matters clinically because scapular and shoulder position couples with cervical posture during dentistry.</p></div>
        <div><span>BONE FUNCTION</span><h3>Support, protection, leverage, storage</h3><p>Bone supports soft tissues, protects organs, supplies lever arms, stores calcium and phosphate, and houses marrow. Cortical and trabecular architecture adapt to mechanical loading.</p></div>
        <div><span>DENTAL INTEGRATION</span><h3>Posture, airway, imaging, anesthesia</h3><p>Connect cervical levels to the hyoid, larynx, pharynx, vertebral arteries, cervical nerves, and operator posture. Use bony landmarks to orient panoramic, cephalometric, CBCT, and head-and-neck images.</p></div>
      </div>
    </section>

    <section className="skeletalSystemsLab">
      <div className="sectionHeading"><span className="selectedPill">BONE + JOINT BIOLOGY</span><h2>From tissue organization to movement</h2><p>Osteology is more than naming bones. Pair gross landmarks with tissue, cells, joint type, load, and remodeling.</p></div>
      <div className="skeletalConceptColumns">
        <div className="conceptPanel">
          <span>CELLULAR & TISSUE LEVEL</span>
          {[
            ["Cortical bone", "Dense osteonal shell that resists bending and torsion; thick where high structural stiffness is required."],
            ["Trabecular bone", "A lattice aligned with habitual load paths; reduces mass and houses marrow spaces."],
            ["Osteoblast → osteocyte", "Osteoblasts deposit osteoid; embedded cells become osteocytes that sense strain through the lacunocanalicular network."],
            ["Osteoclast", "Multinucleated resorptive cell that acidifies and removes mineralized matrix during growth, repair, and remodeling."],
            ["Periosteum & endosteum", "Vascular cellular linings on outer and inner bone surfaces; important for appositional growth, repair, and remodeling."],
            ["Woven → lamellar bone", "Rapid woven bone is replaced by organized lamellar bone as healing and mechanical adaptation progress."],
          ].map(([name, text]) => <article key={name}><b>{name}</b><p>{text}</p></article>)}
        </div>
        <div className="conceptPanel">
          <span>JOINT CLASSIFICATION</span>
          {[
            ["Fibrous · suture", "Dense connective tissue joins skull bones; morphology includes serrate, plane, and squamous patterns."],
            ["Fibrous · gomphosis", "Periodontal ligament suspends a tooth root in its alveolus—the skeletal joint most directly tied to dentistry."],
            ["Cartilaginous", "Synchondroses use hyaline cartilage; symphyses use fibrocartilage, as in intervertebral discs and the pubic symphysis."],
            ["Synovial · hinge / pivot", "Hinge joints favor one axis; pivot joints permit rotation, exemplified by the median atlantoaxial joint."],
            ["Synovial · condyloid / saddle", "Condyloid joints allow biaxial motion; saddle surfaces permit wide movement, as at the thumb CMC joint."],
            ["Synovial · ball-and-socket / plane", "Ball-and-socket joints are multiaxial; plane joints glide, as at many carpal, tarsal, and facet joints."],
          ].map(([name, text]) => <article key={name}><b>{name}</b><p>{text}</p></article>)}
        </div>
      </div>
      <div className="remodelingSequence" aria-label="Bone remodeling sequence">
        {[
          ["1", "Activation", "Mechanical or biochemical signals recruit a remodeling unit."],
          ["2", "Resorption", "Osteoclasts remove a controlled volume of mineralized matrix."],
          ["3", "Reversal", "The surface is prepared and resorption transitions to formation."],
          ["4", "Formation", "Osteoblasts deposit osteoid that subsequently mineralizes."],
          ["5", "Adaptation", "New lamellar architecture responds to load and local biology."],
        ].map(([number, name, text]) => <div key={number}><span>{number}</span><b>{name}</b><p>{text}</p></div>)}
      </div>
    </section>

    <section className="dentalSpineFocus">
      <div><span className="selectedPill">CLINICAL STUDY CHECKLIST</span><h2>Cervical-spine knowledge for dentistry</h2></div>
      <ul>
        <li><b>Positioning:</b> support the normal cervical curve and avoid forcing extension or rotation in patients with pain, trauma, instability, arthritis, or neurologic symptoms.</li>
        <li><b>Airway:</b> relate C3 to the hyoid, C4–C5 to the thyroid cartilage, and C6 to the cricoid cartilage and pharyngoesophageal transition.</li>
        <li><b>Vessels:</b> vertebral arteries usually enter the transverse foramina at C6, ascend through C1–C6, and curve over C1 before the foramen magnum.</li>
        <li><b>Nerves:</b> C1–C7 nerves exit above their matching vertebrae; C8 exits between C7 and T1; thoracic and lumbar nerves exit below their matching vertebrae.</li>
        <li><b>Ergonomics:</b> neutral lumbar support, balanced thoracic posture, and slight controlled head inclination reduce sustained cervical flexion.</li>
        <li><b>Scope:</b> this section is for anatomy learning and positioning awareness—not diagnosis or manipulation of the cervical spine.</li>
      </ul>
    </section>
  </div>;
}

function BodyAtlas({ headOnly }: { headOnly: boolean }) {
  const [system, setSystem] = useState(0);
  const [modelIndex, setModelIndex] = useState(0);
  const data = headOnly ? headStructures : systems;
  const models = headOnly ? headModels : bodyModels;
  const model = models[modelIndex];
  return <div className="bodyGrid">
    <section className="bodyViewer">
      <div className="viewerHeading"><div><h1>{headOnly ? "Head & neck anatomy" : "Whole-body anatomy"}</h1><p>{headOnly ? "Detailed bones · spaces · muscles · nerves" : "Interactive skeletal and regional foundations"}</p></div><span className="liveDot">True 3D viewer</span></div>
      <ModelFrame model={model} originalPreset={headOnly ? "head" : "body"} />
      <div className="modelTabs">{models.map((m, i) => <button key={m.uid} className={modelIndex === i ? "on" : ""} onClick={() => setModelIndex(i)}>{m.title}</button>)}</div>
    </section>
    <aside className="systemPanel"><span className="selectedPill">CURRICULUM MAP</span><h2>{headOnly ? "Regional anatomy" : "Body systems"}</h2><p>Select a system to focus the atlas and clinical links.</p>
      <div className="systemList">{data.map((s, i) => <button key={s[0]} className={system === i ? "on" : ""} onClick={() => setSystem(i)}><i style={{ background: s[4] }} /><span><b>{s[0]}</b><small>{s[1]}</small></span></button>)}</div>
      <LearningBlock label="Definition" text={data[system][1]} />
      <LearningBlock label="Core functions" text={data[system][2]} />
      <div className="clinicalPearl"><b>{headOnly ? "Study connection" : "Dental connection"}</b><p>{data[system][3]}</p></div>
    </aside>
  </div>;
}

function Histology() {
  const [selected, setSelected] = useState(0);
  return <div className="studyPage"><div className="pageIntro"><span className="selectedPill">MICROSCOPY LAB</span><h1>Oral histology</h1><p>Recognize tissues by architecture, cells, matrix, and function.</p></div>
    <div className="histologyGrid"><section className="micrograph"><div className={`histologyCrop crop${selected}`}><img src={`${publicBasePath}/atlas/oral-histology-plate.webp`} alt="Schematic oral histology study plate with six microscopy-inspired fields" /></div><div className="figureCaption">Illustrated study field · Compare with assigned glass slides</div></section>
      <aside className="slideNotes"><span>STUDY FIELD {String(selected + 1).padStart(2, "0")}</span><h2>{tissues[selected][0]}</h2><LearningBlock label="Definition" text={tissues[selected][1]} /><LearningBlock label="Function" text={tissues[selected][2]} /><h3>How to recognize it</h3><p>{tissues[selected][3]}</p><h3>Recognition method</h3><ul><li>Identify the dominant cell or matrix</li><li>Trace the tissue boundary</li><li>Connect structure to function</li></ul></aside>
    </div>
    <div className="tissueTabs">{tissues.map((t, i) => <button className={selected === i ? "on" : ""} onClick={() => setSelected(i)} key={t[0]}><span>{i + 1}</span>{t[0]}</button>)}</div>
    <section className="tissue3d">
      <div><span className="selectedPill">3D TISSUE RELATIONSHIPS</span><h2>From crown surface to pulp</h2><p>Rotate the section to connect the tissue layers with the microscopic field above. Three-dimensional form and histology answer different questions, so both are included.</p></div>
      <ModelFrame model={toothTissueModel} originalPreset="tissue" />
    </section>
  </div>;
}

function Pathology() {
  const [selected, setSelected] = useState(0);
  return <div className="studyPage"><div className="pageIntro"><span className="selectedPill">PATTERN VOCABULARY</span><h1>Oral pathology foundations</h1><p>Learn how to describe lesion patterns—not how to diagnose a patient from an image.</p></div>
    <div className="pathGrid"><div className={`lesion lesion${selected}`}><span /><span /><span /><b>Schematic pattern model</b></div>
      <aside className="slideNotes"><span>LEARNING CARD {String(selected + 1).padStart(2, "0")}</span><h2>{lesions[selected][0]}</h2><LearningBlock label="Definition" text={lesions[selected][1]} /><LearningBlock label="Learning function" text={lesions[selected][2]} /><h3>Description sequence</h3><p>Site → number → size → color → surface → border → consistency → symptoms → duration.</p><div className="warning">Illustrations are teaching schematics. They are not clinical photographs and must not be used for diagnosis.</div></aside>
    </div>
    <div className="caseTabs">{lesions.map((l, i) => <button className={selected === i ? "on" : ""} onClick={() => setSelected(i)} key={l[0]}>{l[0]}</button>)}</div>
  </div>;
}

function Quiz({ answer, setAnswer }: { answer: boolean | null; setAnswer: (answer: boolean) => void }) {
  return <div className="quizPage"><span className="selectedPill">ACTIVE RECALL</span><h1>Identify the tooth</h1><p>Use morphology and location before revealing the answer.</p>
    <div className="quizCard"><div className="quizModel"><ModelFrame model={toothModels.maxillary6} originalPreset="tooth" /></div><div className="quizPrompt"><span>QUESTION 01 / 01</span><h2>This maxillary tooth usually has three roots, four major cusps, an oblique ridge, and may show a cusp of Carabelli. Which is it?</h2>
      {["First molar", "Second premolar", "Canine", "Mandibular first molar"].map((a, i) => <button onClick={() => setAnswer(i === 0)} className={answer !== null && i === 0 ? "correct" : ""} key={a}>{String.fromCharCode(65 + i)}. {a}</button>)}
      {answer !== null && <div className={answer ? "feedback good" : "feedback"}>{answer ? "Correct — now identify the oblique ridge and cusp of Carabelli." : "Not quite. Three roots strongly suggests a maxillary molar."}</div>}
    </div></div>
  </div>;
}

function References() {
  return <footer id="references" className="references">
    <div><span className="selectedPill">LEARNING SCOPE</span><h2>Educational models, definitions, and functions</h2><p>This atlas is a study aid. Models simplify three-dimensional anatomy, and illustrated fields are not substitutes for cadaveric study, glass slides, radiographs, faculty instruction, or clinical evaluation.</p></div>
    <div><h3>Core references</h3>{references.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div>
  </footer>;
}
