/*
    
    Plans Controller
    Author: Sunny Khattri
    Date: 18-06-2018

*/

var plansApp = angular.module("plansQuoteApp", []);

plansApp.controller("plansQuoteCtrl", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', function($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location) {

    var pC = this;
    var aS = appService;
    pC.hideEssential = true;
    pC.productName = sessionStorage.getItem('pName');
    pC.imdCode = sessionStorage.getItem('imdCode');
    var listA = "<table class='table'><tbody><tr><td colspan='3' bgcolor='#ffffff' style='color:#000; font-weight:bold; text-align: left;'>List A</td></tr><tr><td class='red3'>1</td><td class='red4'>Cancer of Specified Severity</td></tr><tr><td class='red3'>2</td><td class='red4'>Myocardial Infarction (First Heart Attack of specific severity)</td></tr><tr><td class='red3'>3</td><td class='red4'>Open Chest CABG</td></tr><tr><td class='red3'>4</td><td class='red4'>Open Heart Replacement Or Repair Of Heart Valves</td></tr><tr><td class='red3'>5</td><td class='red4'>Kidney Failure Requiring Regular Dialysis</td></tr><tr><td class='red3'>6</td><td class='red4'>Stroke Resulting In Permanent Symptoms</td></tr><tr><td class='red3'>7</td><td class='red4'>Major Organ / Bone Marrow Transplant</td></tr><tr><td class='red3'>8</td><td class='red4'>Permanent Paralysis Of Limbs</td></tr><tr><td class='red3'>9</td><td class='red4'>Multiple Sclerosis With Persisting Symptoms</td></tr><tr><td class='red3'>10</td><td class='red4'>Coma of Specified Severity</td></tr><tr><td class='red3'>11</td><td class='red4'>Motor Neuron Disease With Permanent Symptoms</td></tr><tr><td class='red3'>12</td><td class='red4'>Third Degree Burns</td></tr><tr><td class='red3'>13</td><td class='red4'>Deafness</td></tr><tr><td class='red3'>14</td><td class='red4'>Loss of Speech</td></tr><tr><td class='red3'>15</td><td class='red4'>Aplastic Anaemia</td></tr><tr><td class='red3'>16</td><td class='red4'>End Stage Liver Failure</td></tr><tr><td class='red3'>17</td><td class='red4'>End Stage Lung Failure</td></tr><tr><td class='red3'>18</td><td class='red4'>Bacterial Meningitis</td></tr><tr><td class='red3'>19</td><td class='red4'>Fulminant Hepatitis</td></tr><tr><td class='red3'>20</td><td class='red4'>Muscular Dystrophy</td></tr><tr><td class='red3'>21</td><td class='red4'>Parkinson’s disease</td></tr><tr><td class='red3'>22</td><td class='red4'>Benign Brain Tumor</td></tr><tr><td class='red3'>23</td><td class='red4'>Alzheimer’s Disease</td></tr><tr><td class='red3'>24</td><td class='red4'>Aorta Graft Surgery</td></tr><tr><td class='red3'>25</td><td class='red4'>Loss of Limbs</td></tr><tr><td class='red3'>26</td><td class='red4'>Blindness</td></tr><tr><td class='red3'>27</td><td class='red4'>Primary (Idiopathic) Pulmonary Hypertension</td></tr><tr><td class='red3'>28</td><td class='red4'>Apallic Syndrome or Persistent Vegetative State (PVS)</td></tr><tr><td class='red3'>29</td><td class='red4'>Encephalitis</td></tr><tr><td class='red3'>30</td><td class='red4'>Chronic Relapsing Pancreatitis</td></tr><tr><td class='red3'>31</td><td class='red4'>Major Head Trauma</td></tr><tr><td class='red3'>32</td><td class='red4'>Medullary Cystic Disease</td></tr><tr><td class='red3'>33</td><td class='red4'>Poliomyelitis</td></tr><tr><td class='red3'>34</td><td class='red4'>Systemic Lupus Erythematous</td></tr><tr><td class='red3'>35</td><td class='red4'>Brain Surgery</td></tr><tr><td class='red3'>36</td><td class='red4'>Severe Rheumatoid Arthritis</td></tr><tr><td class='red3'>37</td><td class='red4'>Creutzfeldt-Jakob disease</td></tr><tr><td class='red3'>38</td><td class='red4'>Hemiplegia</td></tr><tr><td class='red3'>39</td><td class='red4'>Tuberculosis Meningitis</td></tr><tr><td class='red3'>40</td><td class='red4'>Dissecting Aortic aneurysm</td></tr><tr><td class='red3'>41</td><td class='red4'>Progressive Supranuclear Palsy – resulting in permanent symptoms</td></tr><tr><td class='red3'>42</td><td class='red4'>Myasthenia Gravis</td></tr><tr><td class='red3'>43</td><td class='red4'>Infective Endocarditis</td></tr><tr><td class='red3'>44</td><td class='red4'>Pheochromocytoma</td></tr><tr><td class='red3'>45</td><td class='red4'>Eisenmenger's Syndrome</td></tr><tr><td class='red3'>46</td><td class='red4'>Chronic Adrenal Insufficiency</td></tr><tr><td class='red3'>47</td><td class='red4'>Progressive Scleroderma</td></tr><tr><td class='red3'>48</td><td class='red4'>Elephantiasis</td></tr><tr><td class='red3'>49</td><td class='red4'>Cardiomyopathy – of specified severity</td></tr><tr><td class='red3'>50</td><td class='red4'>Myelofibrosis</td></tr><tr></tbody></table>";

    var listB = "<table class='table'><tbody><tr><td colspan='3' bgcolor='#ffffff' style='color:#000; font-weight:bold; text-align: left;'>List B</td></tr><tr><td class='red3'>51</td><td class='red4'>Angioplasty</td></tr><tr><td class='red3'>52</td><td class='red4'>Pericardectomy</td></tr><tr><td class='red3'>53</td><td class='red4'>Ovarian tumour of borderline malignancy/low malignant potential – with surgical removal of an ovary</td></tr><tr><td class='red3'>54</td><td class='red4'>Keyhole Coronary Surgery</td></tr><tr><td class='red3'>55</td><td class='red4'>Severe Crohn’s disease – surgically treated</td></tr><tr><td class='red3'>56</td><td class='red4'>Cardiac Defibrillator insertion or Cardiac Pacemaker insertion</td></tr><tr><td class='red3'>57</td><td class='red4'>Carcinoma in-situ of the cervix uteri – requiring treatment with hysterectomy</td></tr><tr><td class='red3'>58</td><td class='red4'>Carcinoma in-situ of the urinary bladder</td></tr><tr><td class='red3'>59</td><td class='red4'>Carotid Artery Surgery</td></tr><tr><td class='red3'>60</td><td class='red4'>Ductal or Lobular carcinoma in-situ of the breast – with specified treatment</td></tr><tr><td class='red3'>61</td><td class='red4'>Small Bowel Transplant</td></tr><tr><td class='red3'>62</td><td class='red4'>Severe ulcerative colitis – with operation to remove the entire large bowel</td></tr><tr><td class='red3'>63</td><td class='red4'>Testicular carcinoma in situ – requiring surgery to remove at least one testicle</td></tr><tr><td class='red3'>64</td><td class='red4'>Surgical removal of an eyeball</td></tr><tr></tr></tbody></table>";

    var platinumExplorePlan = '<table align="center" border="0" cellpadding="6" cellspacing="0" class="table"> <tbody> <tr> <td bgcolor="#C5252F" rowspan="2">&nbsp;</td> <td align="left" bgcolor="#C5252F" class="tblheading" rowspan="2" style="color: #fff;font-weight: 700" valign="middle" width="206">Plan Comparison</td> <td align="center" bgcolor="#C5252F" class="tblheading" colspan="3" style="color: #fff;font-weight: 700" valign="bottom">Platinum</td> </tr> <tr> <td bgcolor="#C5252F" style="font-weight:bold; color:#fff;" valign="bottom">Essential</td> <td bgcolor="#C5252F" style="font-weight:bold; color:#fff;" valign="bottom">Enhanced</td> <td bgcolor="#C5252F" style="font-weight:bold; color:#fff;" valign="bottom">Premiere</td> </tr> <tr> <td rowspan="2">&nbsp;</td> <td align="left" style="font-weight:bold;" valign="top">Policy Term</td> <td align="center" colspan="3" valign="top">1, 2 or 3 years</td> </tr> <tr> <td style="font-weight:bold;">Sum Insured</td> <td>Rs 50k - Rs 10 Lacs</td> <td>Rs 2 Lacs - Rs 2 Crores</td> <td>Rs 10 Lacs to 2 Crores</td> </tr> <tr> <td bgcolor="#694743" colspan="5" style="color:#fff; font-weight:bold;">I. &nbsp; Basic Covers</td> </tr> <tr> <td style="color:#000;">a</td> <td align="left" style="font-weight:bold;" valign="top">In-patient Hospitalization</td> <td align="left" valign="top">Choice from economy to single private room.</td> <td align="left" valign="top">Choice from shared to any room category.</td> </tr> <tr> <td style="color:#000;">b</td> <td align="left" style="font-weight:bold;" valign="top">Pre-hospitalization Medical Expenses</td> <td align="left" valign="top">30 days</td> <td align="left" valign="top">60 days</td> <td align="left" valign="top">60 days</td> </tr> <tr> <td style="color:#000;">c</td> <td align="left" style="font-weight:bold;" valign="top">Post-hospitalization Medical Expenses</td> <td align="left" valign="top">60 days</td> <td align="left" valign="top">180 days</td> <td align="left" valign="top">180 days</td> </tr> <tr> <td style="color:#000;">d</td> <td align="left" style="font-weight:bold;" valign="top">Day care Treatment</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">e</td> <td align="left" style="font-weight:bold;" valign="top">Domiciliary Hospitalization</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">f</td> <td align="left" style="font-weight:bold;" valign="top">Road Ambulance Cover</td> <td align="left" valign="top">Actuals in network, Rs 2000 in non-network</td> <td align="left" valign="top">Actuals in network, Rs 5000 in non-network</td> <td align="left" valign="top">Actuals in network, Rs 5000 in non-network</td> </tr> <tr> <td style="color:#000;">g</td> <td align="left" style="font-weight:bold;" valign="top">Organ Donor Expenses</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">h</td> <td align="left" style="font-weight:bold;" valign="top">Reload of Sum Insured</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Not Available</td> </tr> <tr> <td style="color:#000;">i</td> <td align="left" style="font-weight:bold;" valign="top">Super Reload</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">100% unlimited reload, available for same and unrelated illness</td> </tr> <tr> <td style="color:#000;">j</td> <td align="left" style="font-weight:bold;" valign="top">AYUSH Cover</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">k</td> <td align="left" style="font-weight:bold;" valign="top">Mental Illness Hospitalisation</td> <td align="left" valign="top"> Rs. 50,000 (Upto SI of 4L)<br> Rs. 1,00,000 (Upto SI of 5L & Above)</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">l</td> <td align="left" style="font-weight:bold;" valign="top">Obesity Treatment</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">m</td> <td align="left" style="font-weight:bold;" valign="top">Home Treatment</td> <td align="left" valign="top"> Rs. 25,000 (Upto SI of 4L)<br> Rs. 50,000 (Upto SI of 5L & Above)</td> <td align="left" valign="top">Covered up to Sum Insured</td> <td align="left" valign="top">Covered up to Sum Insured</td> </tr> <tr> <td style="color:#000;">n</td> <td align="left" style="font-weight:bold;" valign="top">Modern Treatment Methods and Advancement in Technologies</td> <td align="left" valign="top">Available for Listed Procedures.<br> Co-Payment of 50% for Robotic Surgeries</td> <td align="left" valign="top">Available for Listed Procedures.</td> <td align="left" valign="top">Available for Listed Procedures.</td> </tr> <tr> <td style="color:#000;">o</td> <td align="left" style="font-weight:bold;" valign="top">Post-hospitalisation Physiotherapy cover</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">p</td> <td align="left" style="font-weight:bold;" valign="top">Premium Waiver</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available 1 Policy Year</td> <td align="left" valign="top">Available 1 Policy Year</td> </tr> <tr> <td style="color:#000;">q</td> <td align="left" style="font-weight:bold;" valign="top">Mandatory Co-payment</td> <td align="left" valign="top">20%</td> <td align="left" valign="top">Not Applicable</td> <td align="left" valign="top">Not Applicable</td> </tr> <tr> <td bgcolor="#694743" colspan="5" style="color:#fff; font-weight:bold;">II. &nbsp; Additional Benefits</td> </tr> <tr> <td>r</td> <td align="left" style="font-weight:bold;" valign="top">Cumulative Bonus</td> <td align="left" valign="top">Applicable on Sum Insured:10% increase, Max up to 100% (up to maximum of 50 Lacs)</td> <td align="left" valign="top">Applicable on Sum Insured:50% increase, Max up to 100% (Upto maximum of 1 Cr)</td> <td align="left" valign="top">Applicable on Sum Insured:50% increase, Max up to 100% (Upto maximum of 1 Cr)</td> </tr> <tr> <td style="color:#000;">s</td> <td align="left" style="font-weight:bold;" valign="top">Dental Consultation & Investigations</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available (S.I. 15 Lac and above)</td> <td align="left" valign="top">Available </td> </tr> <tr> <td style="color:#000;">t</td> <td align="left" style="font-weight:bold;" valign="top">Health Check up program</td> <td align="left" valign="top">Available, once in a policy year</td> <td align="left" valign="top">Available, once in a policy year</td> <td align="left" valign="top">Available, once in a policy year</td> </tr> <tr> <td style="color:#000;">u</td> <td align="left" style="font-weight:bold;" valign="top">Second E-Opinion on Critical Illness</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">v</td> <td align="left" style="font-weight:bold;" valign="top">Recovery Benefit</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">1% of Sum Insured, max of INR 10,000</td> <td align="left" valign="top">Not Available</td> </tr> <tr> <td bgcolor="#694743" colspan="5" style="color:#fff; font-weight:bold;">III. &nbsp; Value Added Benefits</td> </tr> <tr> <td>w</td> <td align="left" style="font-weight:bold;" valign="top">Chronic Management Program</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td>x</td> <td align="left" style="font-weight:bold;" valign="top">Health Assessment</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#000;">y</td> <td align="left" style="font-weight:bold;" valign="top">HealthReturns<sup>TM</sup></td> <td align="left" valign="top">Available, up to 50% of Premium</td> <td align="left" valign="top">Available, up to 100% of Premium</td> <td align="left" valign="top">Available, up to 100% of Premium</td> </tr> <tr> <td style="color:#000;">z</td> <td align="left" style="font-weight:bold;" valign="top">Expert Health Coach</td> <td align="left" valign="top">Available - Medical, Nutritional, Mental & Fitness</td> <td align="left" valign="top">Available - Medical, Nutritional, Mental & Fitness (For SI 3 lakhs and below )Available - Medical, Nutritional, Mental & Fitness, Mental Counselling session, Homeopathy tele consultation. (For S.I. 4 Lakhs and above)</td> <td align="left" valign="top">Available - Medical, Nutritional, Mental & Fitness, Mental Counselling session, Homeopathy tele consultation</td> </tr> </tbody> </table>';

    var paExplorePlan = '<table border="0" align="center" cellpadding="0" cellspacing="0" class="table"><tbody><tr style="background: #c7222a;color: #fff;"><td colspan="2" align="left" valign="top">&nbsp;</td><td align="center" class="set2" valign="top" style="font-size: 24px;">Plan 1</td><td align="center" class="set2" valign="top" style="font-size: 24px;">Plan 2</td><td align="center" class="set2" valign="top" style="font-size: 24px;">Plan 3</td><td align="center" class="set2" valign="top" style="font-size: 24px;">Plan 4</td><td align="center" class="set2" valign="top" style="font-size: 24px;">Plan 5</td></tr><tr><td rowspan="4" class="set" style="color:#000;">&nbsp;</td><td rowspan="4" align="left" valign="top" class="set2" style="font-weight:bold;color:#000;">Sum insured (Rs.)</td><td align="left" valign="top"><strong>1 – 10 lakhs</strong><br>(in multiples of 1 lakh)</td><td align="left" valign="top"><strong>1 – 10 lakhs</strong><br>(in multiples of 1 lakh)</td><td align="left" valign="top"><strong>1 – 10 lakhs</strong><br>(in multiples of 1 lakh)</td><td align="left" valign="top"><strong>5 – 10 lakhs</strong><br>(in multiples of 1 lakh)</td><td align="left" valign="top"><strong>-</strong></td></tr><tr><td align="left" valign="top"><strong>15 – 25 lakhs</strong><br>(in multiples of 5 lakhs)</td><td align="left" valign="top"><strong>15 – 25 lakhs</strong><br>(in multiples of 5 lakhs)</td><td align="left" valign="top"><strong>15 – 25 lakhs</strong><br>(in multiples of 5 lakhs)</td><td align="left" valign="top"><strong>15 – 25 lakhs</strong><br>(in multiples of 5 lakhs)</td><td align="left" valign="top"><strong>15 – 25 lakhs</strong><br>(in multiples of 5 lakhs)</td></tr><tr><td align="left" valign="top"><strong>30 – 50 lakhs</strong><br>(in multiples of 10 lakhs)</td><td align="left" valign="top"><strong>30 – 50 lakhs</strong><br>(in multiples of 10 lakhs)</td><td align="left" valign="top"><strong>30 – 50 lakhs</strong><br>(in multiples of 10 lakhs)</td><td align="left" valign="top"><strong>30 – 50 lakhs</strong><br>(in multiples of 10 lakhs)</td><td align="left" valign="top"><strong>30 – 50 lakhs</strong><br>(in multiples of 10 lakhs)</td></tr><tr><td align="left" valign="top"><strong>1 cr, 1.5 cr, 2 cr</strong></td><td align="left" valign="top"><strong>1 cr, 1.5 cr, 2 cr, 5 cr</strong></td><td align="left" valign="top"><strong>1 cr, 1.5 cr, 2 cr, 5 cr</strong></td><td align="left" valign="top"><strong>1 cr, 1.5 cr, 2 cr, 5 cr, 10 cr</strong></td><td align="left" valign="top"><strong>1 cr, 1.5 cr, 2 cr, 5 cr, 7.5 cr, 10 cr, 15 cr, 20 cr</strong></td></tr><tr><td colspan="7" bgcolor="#f2f3f6" style="color:#000; font-weight:bold; background-color:#e4e4e4;">I. &nbsp; Basic Covers</td></tr><tr><td style="color:#000;">a</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Accidental Death Cover (AD)</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td></tr><tr><td style="color:#000;">b</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Permanent Total Disablement (PTD)</td><td align="left" valign="top">-</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td></tr><tr><td style="color:#000;">c</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Permanent Partial Disablement (PPD)</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td><td align="left" valign="top">100% of sum insured</td></tr><tr><td style="color:#000;">d</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Education Fund</td><td align="left" valign="top">10% of sum insured max up to Rs.10 Lakhs</td><td align="left" valign="top">10% of sum insured max up to Rs.10 Lakhs</td><td align="left" valign="top">10% of sum insured max up to Rs.10 Lakhs</td><td align="left" valign="top">10% of sum insured max up to Rs.10 Lakhs</td><td align="left" valign="top">10% of sum insured max up to Rs.10 Lakhs</td></tr><tr><td style="color:#000;">e</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Emergency Road Ambulance Cover</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Covered up to Rs.10,000</td><td align="left" valign="top">Covered up to Rs.10,000</td></tr><tr><td style="color:#000;">f</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Funeral Expenses</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Covered up to 1% of sum insured max up to Rs.50,000</td><td align="left" valign="top">Covered up to 1% of sum insured max up to Rs.50,000</td></tr><tr><td style="color:#000;">g</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Repatriation of Mortal Remains</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Lump sum benefit of Rs.50,000</td></tr><tr><td style="color:#000;">h</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Orphan Benefit</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Lump sum benefit of 10% of sum insured, max up to Rs.15 Lakhs</td></tr><tr><td style="color:#000;">i</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Modification Benefit (Residence and Vehicle)</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Covered up to Rs.1 Lakh</td></tr><tr><td style="color:#000;">j</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Compassionate Visit</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">-</td><td align="left" valign="top">Domestic: up to Rs.10,000<br>International: up to Rs.25,000</td></tr><tr><td style="color:#000;">k</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Cumulative Bonus</td><td align="left" valign="top">5% per claim free year, max 50% of Sum Insured</td><td align="left" valign="top">5% per claim free year, max 50% of Sum Insured</td><td align="left" valign="top">5% per claim free year, max 50% of Sum Insured</td><td align="left" valign="top">5% per claim free year, max 50% of Sum Insured</td><td align="left" valign="top">5% per claim free year, max 50% of Sum Insured. Applicable for Sum Insured up to Rs.10 Crores only.</td></tr><tr><td colspan="7" bgcolor="#f2f3f6" style="color:#000; font-weight:bold; background-color:#e4e4e4;">II. &nbsp; Optional Covers</td></tr><tr><td style="color:#000;">l</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Temporary Total Disablement (TTD)</td><td colspan="5" align="left" valign="top">• Weekly benefit options (in Rs.): 1000, 2000, 3000, 4000, 5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000<br>• Maximum TTD limit can be 2 times the income.</td></tr><tr><td style="color:#000;">m</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Accidental In-patient Hospitalization Cover</td><td colspan="5" align="left" valign="top">Covered up to 1% of Accidental Death Sum Insured or Rs.1 Lakh whichever is higher</td></tr><tr><td style="color:#000;">n</td><td align="left" valign="top" style="font-weight:bold;color:#000;">EMI Protect</td><td colspan="5" align="left" valign="top">3 EMIs totaling upto the following options (in Rs.): 50000, 75000, 100000, 200000, 300000, 400000, 500000</td></tr><tr><td style="color:#000;">o</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Broken Bones Benefit</td><td colspan="5" align="left" valign="top">Benefit limit up to Rs.1 Lakh/Rs.3 Lakhs/Rs.5 Lakhs (lump sum as per table)</td></tr><tr><td style="color:#000;">p</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Loan Protect</td><td colspan="5" align="left" valign="top">Available with Personal Accident sum insured up to Rs.10 Crores only<br>Options in Rs.: • 1 lakh – 10 lakhs (in multiples of 1 lakh)<br>• 15 lakhs – 25 lakhs (in multiples of 5 lakhs),<br>• 30 lakhs – 50 lakhs (in multiples of 10 lakhs)<br>• 1 cr, 1.5 cr, 2 cr, 5 cr<br>Option may be chosen maximum up to Accidental Death Sum Insured amount</td></tr><tr><td style="color:#000;">q</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Coma Benefit</td><td colspan="5" align="left" valign="top">• Benefit limit equal to Accidental Death Cover<br>• Sum Insured maximum up to Rs.10 Lakhs</td></tr><tr><td style="color:#000;">r</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Burn Benefit</td><td colspan="5" align="left" valign="top">Benefit limit up to Rs.1Lakh/Rs.2 Lakhs/Rs.3 Lakhs (lump sum as per table)</td></tr><tr><td style="color:#000;">s</td><td align="left" valign="top" style="font-weight:normal;color:#000;"><strong>Accidental Medical Expenses</strong><br>(OPD including Day Care)</td><td colspan="5" align="left" valign="top">Coverage up to the lowest of following:<br>1) Actual Expenses<br>2) 10% of Accidental Death Sum Insured<br>3) 40% of admissible claim under Permanent Total Disablement<br>4) 40% of admissible claim under Permanent Partial Disablement<br>5) 40% of admissible claim under Temporary Total Disablement<br>6) Rs.50,000</td></tr><tr><td style="color:#000;">u</td><td align="left" valign="top" style="font-weight:normal;color:#000;"><strong>Adventure Sports Cover</strong></td><td colspan="5" align="left" valign="top">Benefit up to Accidental Death Cover Sum Insured, maximum up to Rs.10 Lakhs Cover</td></tr><tr><td style="color:#000;">v</td><td align="left" valign="top" style="font-weight:bold;color:#000;">Worldwide Emergency Assistance Services</td><td colspan="5" align="left" valign="top">Available (including Air Ambulance)</td></tr></tbody></table>';

    var ciExplorePlan = '<table border="0" align="center" cellpadding="6" cellspacing="0" class="table"><tbody><tr style="background: #c7222a;color: #fff;"><td colspan="2" align="left" valign="top">&nbsp;</td><td align="center" valign="top" style="font-size: 24px;">Plan 1</td><td align="center" valign="top" style="font-size: 24px;">Plan 2</td><td align="center" valign="top" style="font-size: 24px;">Plan 3</td></tr><tr><td align="left" valign="top">a.</td><td align="left" valign="top" style="font-weight:bold;">Sum Insured</td><td align="left" valign="top">1 – 10 lakhs (in multiples of 1 lakh)<br>15 – 25 lakhs (in multiples of 5 lakhs)<br>30 – 50 lakhs (in multiples of 10 lakhs)<br>1 crore</td><td align="left" valign="top">1 – 10 lakhs (in multiples of 1 lakh)<br>15 – 25 lakhs (in multiples of 5 lakhs)<br>30 – 50 lakhs (in multiples of 10 lakhs)<br>1 crore</td><td align="left" valign="top">5 – 10 lakhs (in multiples of 1 lakh)<br>15 – 25 lakhs (in multiples of 5 lakhs)<br>30 – 50 lakhs (in multiples of 10 lakhs)<br>1 crore</td></tr><tr><td align="left" valign="top">b.</td><td align="left" valign="top" style="font-weight:bold;">Critical Illnesses Cover</td><td align="left" valign="top">20 (100% sum insured)</td><td align="left" valign="top">50 (100% sum insured)</td><td align="left" valign="top">64 (100% sum insured for <a href="unsafe:javascript:void(0)" data-list="1" class="list-cta list-a-b" style="color: #6B7173; text-decoration:underline;">List A</a> and<br>50% sum insured maximum<br>Rs.10 Lakhs for <a href="unsafe:javascript:void(0)" class="list-cta list-a-b" data-list="2" style="color: #6B7173;text-decoration:underline;">List B</a>)</td></tr><tr><td align="left" valign="top">c.</td><td align="left" valign="top" style="font-weight:bold;">Initial Waiting Period</td><td align="left" valign="top">90 days</td><td align="left" valign="top">90 days</td><td align="left" valign="top">90 days (<a href="unsafe:javascript:void(0)" data-list="1" class="list-cta list-a-b" style="color: #6B7173;text-decoration:underline;">List A</a>) / 180 days (<a href="unsafe:javascript:void(0)" data-list="2" class="list-cta list-a-b" style="color: #6B7173;text-decoration:underline;">List B</a>)</td></tr><tr><td align="left" valign="top">d.</td><td align="left" valign="top" style="font-weight:bold;">Survival Period</td><td align="left" valign="top">15 Days</td><td align="left" valign="top">15 Days</td><td align="left" valign="top">15 Days</td></tr><tr><td colspan="5" bgcolor="#e4e4e4" style="color:#6B7173; font-weight:bold;">Optional Covers</td></tr><tr><td style="color:#6B7173;">a.</td><td align="left" valign="top" style="font-weight:bold;">Second E Opinion</td><td align="left" valign="top">Available</td><td align="left" valign="top">Available</td><td align="left" valign="top">Available</td></tr><tr><td style="color:#6B7173;">b.</td><td align="left" valign="top" style="font-weight:bold;">Wellness Coach</td><td align="left" valign="top">Available</td><td align="left" valign="top">Available</td><td align="left" valign="top">Available</td></tr></tbody></table>';

    var acExplorePlan = '<table border="0" align="center" cellpadding="6" cellspacing="0" class="table" > <tbody> <tr style="background: #c7222a;color: #fff;"> <td colspan="2" align="left" valign="top">&nbsp;</td> <td align="center" valign="top" style="font-size: 24px;">Standard</td> <td align="center" valign="top" style="font-size: 24px;">Classic</td> <td align="center" valign="top" style="font-size: 24px;">Premier</td> </tr> <tr> <td style="color:#6B7173;">a.</td> <td align="left" valign="top" style="font-weight:bold;">Sum Insured (S.I.) Options Rs.</td> <td align="left" valign="top">3L ,4L, 5L, 7.5L, 10L</td> <td align="left" valign="top">3L, 4L, 5L, 7.5L, 10L</td> <td align="left" valign="top">5L, 7.5L, 10L, 25L</td> </tr> <tr> <td style="color:#6B7173;">b.</td> <td align="left" valign="top" style="font-weight:bold;">In-patient Hospitalisation</td> <td align="left" valign="top">Covered </td> <td align="left" valign="top">Covered </td> <td align="left" valign="top">Covered </td> </tr> <tr> <td style="color:#6B7173;">c.</td> <td align="left" valign="top" style="font-weight:bold;">Room Type</td> <td align="left" valign="top">Shared Room </td> <td align="left" valign="top">Shared Room </td> <td align="left" valign="top">Single private AC room</td> </tr> <tr> <td style="color:#6B7173;">d.</td> <td align="left" valign="top" style="font-weight:bold;">Pre – hospitalization Medical Expenses </td> <td align="left" valign="top">30 days (max 5% of total hospitalisation expenses combined for both pre and post hospitalisation)</td> <td align="left" valign="top">30 days </td> <td align="left" valign="top">30 days </td> </tr> <tr> <td style="color:#6B7173;">e.</td> <td align="left" valign="top" style="font-weight:bold;">Post – hospitalization Medical Expenses</td> <td align="left" valign="top">60 days (max 5% of total hospitalisation expenses combined for both pre and post hospitalisation)</td> <td align="left" valign="top">60 days </td> <td align="left" valign="top">60 days </td> </tr> <tr> <td style="color:#6B7173;">f.</td> <td align="left" valign="top" style="font-weight:bold;">Day Care Treatment</td> <td align="left" valign="top">586 Day care procedures covered </td> <td align="left" valign="top">586 Day care procedures covered </td> <td align="left" valign="top">586 Day care procedures covered </td> </tr> <tr> <td style="color:#6B7173;">g.</td> <td align="left" valign="top" style="font-weight:bold;">Domiciliary Hospitalization</td> <td align="left" valign="top">Not Available </td> <td align="left" valign="top">Covered up to 10% of S.I. </td> <td align="left" valign="top">Covered upto S.I. </td> </tr> <tr> <td style="color:#6B7173;">h.</td> <td align="left" valign="top" style="font-weight:bold;">Road Ambulance Cover</td> <td align="left" valign="top">upto Rs.2000/ Hospitalisation </td> <td align="left" valign="top">upto Rs.2000/ Hospitalisation </td> <td align="left" valign="top">Network Providers - Covered upto Actual expenses <br> Non- network Providers- Up to Rs 5000/ hospitalisation </td> </tr> <tr> <td style="color:#6B7173;">i.</td> <td align="left" valign="top" style="font-weight:bold;">Organ Donor Expenses </td> <td align="left" valign="top">Not Available </td> <td align="left" valign="top">Covered upto 50% of S.I. </td> <td align="left" valign="top">Covered upto S.I </td> </tr> <tr> <td align="left" valign="top">j.</td> <td align="left" valign="top" style="font-weight:bold;">Reload of Sum Insured</td> <td align="left" valign="top">50% of S.I. once per year</td> <td align="left" valign="top">100% of S.I. once per year</td> <td align="left" valign="top">100% of S.I. once per year</td> </tr> <tr> <td align="left" valign="top">k.</td> <td align="left" valign="top" style="font-weight:bold;">Ayush (In-patient Hospitalization)</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Covered upto 10% S.I.</td> <td align="left" valign="top">Covered upto 25% S.I.</td> </tr> <tr> <td align="left" valign="top">l.</td> <td align="left" valign="top" style="font-weight:bold;">Home Treatment</td> <td align="left" valign="top">S.I. 3L , 4L - Rs.25000<br> S.I. 5L and above - Rs.50000</td> <td align="left" valign="top">S.I. 3L , 4L - Rs.25000 <br> S.I. 5L and above - Rs.50000</td> <td align="left" valign="top">S.I. 5L and above - Rs.50000</td> </tr> <tr> <td align="left" valign="top">m.</td> <td align="left" valign="top" style="font-weight:bold;">No Claim Bonus</td> <td align="left" valign="top">10% of the S.I. at each renewal in respect of each claim free year of insurance, subject to maximum of 50% </td> <td align="left" valign="top">10% of the S.I. at each renewal in respect of each claim free year of insurance, subject to maximum of 50% </td> <td align="left" valign="top">10% of the S.I. at each renewal in respect of each claim free year of insurance, subject to maximum of 50% </td> </tr> <tr> <td style="color:#6B7173;">n.</td> <td align="left" valign="top" style="font-weight:bold;">OPD Treatment</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Not Available</td> <td align="left" valign="top">Available upto Rs 2500 over and above SI</td> </tr> <tr> <td style="color:#6B7173;">o.</td> <td align="left" valign="top" style="font-weight:bold;">Health Assessment</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#6B7173;">p.</td> <td align="left" valign="top" style="font-weight:bold;">Wellness Coach</td> <td align="left" valign="top">once a policy year</td> <td align="left" valign="top">once a policy year</td> <td align="left" valign="top">once a policy year</td> </tr> <tr> <td style="color:#6B7173;">q.</td> <td align="left" valign="top" style="font-weight:bold;">Comprehensive Health Check-up</td> <td align="left" valign="top">Not available </td> <td align="left" valign="top">once a policy year (only for SI 5L,7.5L & 10L)</td> <td align="left" valign="top">once a policy year</td> </tr> <tr> <td style="color:#6B7173;">r.</td> <td align="left" valign="top" style="font-weight:bold;">Health Coach</td> <td align="left" valign="top">Available (2 sessions per year)</td> <td align="left" valign="top">Available (only for SI 3L & 4L)</td> <td align="left" valign="top">Not available </td> </tr> <tr> <td style="color:#6B7173;">s.</td> <td align="left" valign="top" style="font-weight:bold;">Personal Health Coach</td> <td align="left" valign="top">Not available </td> <td align="left" valign="top">Available (SI 5L & above)</td> <td align="left" valign="top">Available</td> </tr> <tr> <td style="color:#6B7173;">t.</td> <td align="left" valign="top" style="font-weight:bold;">Nursing at Home </td> <td align="left" valign="top">Qualified nurse (maximum upto Rs 1500/day for 15 days per policy year) </td> <td align="left" valign="top">Qualified nurse (maximum upto Rs 1500/day for 15 days per policy year) </td> <td align="left" valign="top">Qualified nurse (maximum upto Rs 1500/day for 15 days per policy year) </td> </tr> </tbody></table>';
    
    /* To instantiate slider */

        function instantiateSlider() {
            pC.showSlickSlider = true;
            $timeout(function(){
                $('.slider').slick({
                    centerMode: (pC.productName == 'Activ Secure Personal Accident') ? false : true,
                    centerPadding: "5px",
                    slidesToShow: (pC.productName == 'Activ Health' || pC.productName == 'Activ Fit') ? slidesToShow = 3 : slidesToShow = 4,
                    infinite: false,
                    arrows: (pC.productName == 'Activ Secure Personal Accident') ? true : false,
                    responsive: [{
                        breakpoint: 1150,
                        settings: {
                            arrows: true,
                            centerMode: false,
                            slidesToShow: (pC.productName == 'Activ Health') ? slidesToShow = 2 : slidesToShow = 3,
                            mobileFirst:true,
                            focusOnSelect:true
                        }
                    },{
                        breakpoint: 993,
                        settings: {
                            arrows: true,
                            centerMode: false,
                            slidesToShow: (pC.productName == 'Activ Health') ? slidesToShow = 2 : slidesToShow = 2,
                            mobileFirst:true,
                            focusOnSelect:true
                        }
                    },{
                        breakpoint: 600,
                        settings: {
                            arrows: true,
                            centerMode: false,
                            slidesToShow: 1,
                            mobileFirst:true,
                            focusOnSelect:true
                        }
                    }]
                });
            },0);
        }

    /* End of instantiating slider */

    pC.exploreFit = function(){
        window.open("assets/policy-wording/explore-fit.pdf");
    }

    pC.openCovidDetaislModel = function(){
        $('#payment-model').modal('toggle')
    }
    pC.closeCovidDetaislModel = function(){
        $('#payment-model').modal('toggle')
    }
    

    /* To Fetch Plans */

        function fetchPlans() {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPlans", {
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    if (data.ResponseCode == 1) {
                      //  pC.planDetails = data.ResponseData;
                      pC.planDetails = [];
                      if(data.ResponseData[0].ProductCode == "PL"){
                        for(var i= 0 ; i< data.ResponseData.length ; i++){
                            if(data.ResponseData[i].PlanName == "Enhanced"){
                                pC.planDetails[0] = data.ResponseData[i];
                            }else if(data.ResponseData[i].PlanName == "Essential"){
                                pC.planDetails[1] = data.ResponseData[i];
                            }
                            else{
                                pC.planDetails.push(data.ResponseData[i]);
                            }
                        }
                        if(pC.hideEssential && pC.planDetails.length == 3){
                            pC.planDetails.splice(1,1);
                        }
                        if(pC.imdCode == 2101286){
                            pC.planDetails = pC.planDetails.filter(plan => plan.PlanName == 'Enhanced');
                        }
                      }
                      else if(data.ResponseData[0].ProductCode == "FIT"){
                        if(pC.membersDetails.length <= 2){
                            data.ResponseData[1]["disabled"]=true;
                            data.ResponseData[1]["disabledStyle"] = {'cursor' : 'initial'}
                            pC.planDetails = data.ResponseData;
                           
                        }
                        else if(!data.ResponseData[1].Premium){
                            pC.planDetails.push(data.ResponseData[0])
                        }
                        else{
                            pC.planDetails = data.ResponseData;
                       }
                      }
                      else if(data.ResponseData[0].ProductCode == "PA"){
                        pC.planDetails.push(data.ResponseData[0])
                      }
                      else{
                           pC.planDetails = data.ResponseData;
                      }

                      

                    //   pC.planDetails = [{"PlanCode":"6212100004",
                    //                     "ProductCode":"PL",
                    //                     "ProductName":"Activ Fit",
                    //                     "PlanName":"Plus",
                    //                     "Features":"[\"feature1\",\"feature2\"]","Premium":"9206","SumInsured":"1000000",
                    //                     "IsSelected":"False"
                    //                 },
                    //                 {"PlanCode":"6212100003",
                    //                 "ProductCode":"AF",
                    //                 "ProductName":"Activ Fit",
                    //                 "PlanName":"Preferred",
                    //                 "Features":"[\"feature1\",\"feature2\"]",
                    //                 "Premium":"13690",
                    //                 "SumInsured":"1000000",
                    //                 "IsSelected":"True"
                    //             }];
                       
                        instantiateSlider();
                    }
                }, function(err) {
                });
        }

       

    /* End of fetching plans */


    /* To fetch insured members */

        function fetchInsuredMembers() {
            var reqData = $rootScope.encrypt({
                "ReferenceNumber": sessionStorage.getItem('rid')
            });
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetInsuredMembers", {
                    "_data": reqData
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    if (data.ResponseCode == 1) {
                        
                        pC.membersDetails = data.ResponseData.ProductInsuredDetail[0].InsuredMembers;
                        if(data.ResponseData.ProductInsuredDetail[0].ProductCode == "PL"){
                            var tempEssential = 0;
                            for(var i=1;i<pC.membersDetails.length;i++){
                                if(pC.membersDetails[i].Age < 55){
                                    tempEssential++
                                }
                            }
                            if(tempEssential == 0){
                                pC.hideEssential = false;
                            }
                        }
                       
                        fetchPlans();
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "gtagPostiveFunction" : "click-button, plans , service-fails[GetInsuredMembers]",
                            "gtagCrossFunction" : "click-button,  plans ,service-fails[GetInsuredMembers]",
                            "gtagNegativeFunction" : "click-button, plans , service-fails[GetInsuredMembers]",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {
                });
        }

        fetchInsuredMembers();

    /* End of fetching insured members */


    /* To buy plans */

        function buyPlans(param) {
            var lemeiskData   = {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "PlanCode": param.PlanCode,
                    "ProductCode": param.ProductCode
                }
            $rootScope.leminiskObj =  lemeiskData
            $rootScope.lemniskCodeExcute($location.$$path)

            var lemniskObj = {
                "Plan Name": param.ProductName + ' ' + param.PlanName,
                "Premium Amount": param.Premium
            };
            $rootScope.lemniskTrack("", "", lemniskObj);

            aS.postData(ABHI_CONFIG.apiUrl + "GEN/BuyPlan", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "PlanCode": param.PlanCode,
                    "ProductCode": param.ProductCode
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        switch (param.ProductCode) {
                            case 'PA':
                                // $location.url('pa-quote-v2');
                                $location.url('pa-quote');
                                break;
                            case 'PL':
                                $location.url('platinum-quote');
                                break;
                            case 'CI':
                                $location.url('ci-quote');
                                break;
                            case 'AC':
                                $location.url('activ-care-quote');
                                break;  
                            case 'FIT':
                                $location.url('fit-quote');
                                break;    
                            default:
                                return;
                        }
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": data.ResponseMessage,
                            "gtagPostiveFunction" : "click-button, plans , service-fails[BuyPlan]",
                            "gtagCrossFunction" : "click-button,  plans ,service-fails[BuyPlan]",
                            "gtagNegativeFunction" : "click-button, plans , service-fails[BuyPlan]",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                }, function(err) {
                });
        }

    /* End of buy plans */


    /* To buy plans validate */

        pC.buyPlansValidate = function(param) {
            var isProceed = true;
            var planName = '';
            if(pC.productName == "Activ Health"){
                planName = "Platinum_"+planData.PlanName;
            }else if(pC.productName == "Activ Secure Personal Accident"){
                planName = "PA_"+planData.PlanName;
            }else if(pC.productName == "Activ Secure Critical Illness"){
                planName = "CI"+planData.PlanName;
            }else if(pC.productName == "Activ Care"){
                planName = "active-care_"+planData.PlanName;
            }
            if(param.disabled){
                return false;
            }
            $rootScope.callGtag('click-item','plans','plan_[buy-'+planName+']');
            if(param.ProductCode == "CI" && param.PlanCode == "3") {
                angular.forEach(pC.membersDetails,function(v,i){
                    if(v.RelationWithProposer == "KID" && isProceed){
                        (v.Age < 18) ? isProceed = false : "";
                    }
                });
                if(isProceed){
                    buyPlans(param);
                }else{
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": "<p>You are not elligible for Plan 3.</p><p>Kids age should not be less than 18.</p>",
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true
                    }
                }
            }else {
                if(param.PlanName == "Essential"){
                    for(var i = 1 ; i <  pC.membersDetails.length ; i++ ){
                            if(  pC.membersDetails[i].RelationWithProposer != 'KID' && pC.membersDetails[i].Age <= 54)
                            {
                                 $rootScope.alertConfiguration('E', "Minimum age allowed is 55 years");
                                        $rootScope.$apply();
                                        return false;   
                            }
                        }
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Choose Enhanced for more benefits",
                        "modalBodyText": "<p>We recommend you to choose Enhanced plan for more benefits and coverage. Do you want to change your plan?</p>",
                        "showCancelBtn": true,
                        "modalSuccessText" : "CHANGE PLAN",
                        "modalCancelText": "DON'T CHANGE",
                        "showAlertModal": true,
                        "positiveFunction": function(){
                            buyPlans(pC.planDetails[1]);
                        },
                        "negativeFunction": function(){
                            buyPlans(param);
                        }
                    }
                    $rootScope.$apply();
                }else{
                    buyPlans(param);
                }
            }
        }

    /* End of buy plans validate */


    /* Click Event to Buy a plan */

        var planData;
        $(document).click(function(event) { 
            if($(event.target).closest('.exp-plan').length) {
                planData = $(event.target).closest('.plans_price_panel').data('json');
                if(!angular.isUndefined(planData)){
                    explorePlan();
                }
            }else if($(event.target).closest('.list-a-b').length){
                showList($(event.target).closest('.list-a-b')[0].outerText);
            }else if($(event.target).closest('#plans-slider-section').length){
                planData = $(event.target).closest('.plans_price_panel').data('json');
                if(!angular.isUndefined(planData)){
                    pC.buyPlansValidate($(event.target).closest('.plans_price_panel').data('json'));
                }
            }
            if($(event.target).hasClass('slick-next')){
                $rootScope.callGtag('click-button','plans','plans-slider-next');
            }else if($(event.target).hasClass('slick-prev')){
                $rootScope.callGtag('click-button','plans','plans-slider-prev');
            }
        });

    /* End of click event to buy a plan */


    /* Function to explore plan */

        function explorePlan(){
            var planDesc;
            var planName;
            if(pC.productName == "Activ Health"){
                planDesc = platinumExplorePlan;
                planName = "Platinum_"+planData.PlanName;
            }else if(pC.productName == "Activ Secure Personal Accident"){
                planDesc = paExplorePlan;
                planName = "PA_"+planData.PlanName;
            }else if(pC.productName == "Activ Secure Critical Illness"){
                planDesc = ciExplorePlan;
                planName = "CI_"+planData.PlanName;
            }else if(pC.productName == "Activ Care"){
                planDesc = acExplorePlan;
                planName = "activ-care_"+planData.PlanName;
            }
            $rootScope.callGtag('click-item','plans','plan_[explore-'+planName+']');
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": "Plans Comparison",
                "modalBodyText": planDesc,
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true,
                "modalClass": "information-modal",
                "gtagPostiveFunction" : 'click-button,plan,plan_[explore-'+planName+']-ok',
                "gtagCrossFunction" : 'click-button,plan,plan_[explore-'+planName+']-x',
                "positiveFunction": function(){
                    delete planDesc;
                }
            }
            $rootScope.$apply();
        }

    /* End of function to explore plan */


    /* To show list a or list b */

        function showList(outerText){
            $rootScope.alertData = {
                "modalClass": "regular-alert",
                "modalHeader": (outerText == 'List A') ? "LIST A" : "LIST B",
                "modalBodyText": (outerText == 'List A') ? listA : listB,
                "showCancelBtn": false,
                "modalSuccessText": "Ok",
                "showAlertModal": true
            }
            $rootScope.$apply();
        }

    /* End of showing list a or list b */


}]);

/* End of plans controller */