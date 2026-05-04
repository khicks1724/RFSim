# RF Planning Prompts

Converted from `rf_plfanning_prompts.txt`.

## RF-001 - Mountain Battalion Command Net

**User Prompt**

Plan a battalion command net in steep mountain terrain using AN/PRC-163 Falcon IV VHF LOS radios between the TAC, two company CPs, and an observation post. Recommend exact ridgeline placement, antenna heights, and whether I need a retrans site to keep LOS while reducing enemy intercept risk from the valley floor.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** mountain, vhf, los, battalion, terrain, retrans, emcon

## RF-002 - Jungle Company Maneuver Net

**User Prompt**

Build a company-level maneuver plan in dense jungle with AN/PRC-152A Falcon III VHF LOS radios during an assault through broken canopy and rolling terrain. Identify dead ground, recommend antenna and power settings, and tell me where to place one relay if the lead platoon drops below line of sight.

- **Primary Radios:** AN/PRC-152A Falcon III (VHF LOS - SINCGARS)
- **Tags:** jungle, company, assault, terrain, mobility, relay, vhf

## RF-003 - Desert Brigade Push With Wide Separation

**User Prompt**

Assess whether AN/PRC-117G Falcon III VHF command-net radios can support a fast desert advance with company teams spread across a 30 km frontage. Show where horizon limits and terrain folds will break the net, and recommend retrans or alternate architecture for the brigade main and TAC.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net)
- **Tags:** desert, brigade, command, mobility, horizon, retrans, vhf

## RF-004 - Valley Withdrawal Fallback Net

**User Prompt**

Design a fallback comms plan for a battalion withdrawal through a narrow valley using AN/PRC-160 VHF fallback analog radios after primary systems fail. Recommend relay placement, minimum power settings, and an alternate route communications posture if the valley walls cause repeated NLOS breaks.

- **Primary Radios:** AN/PRC-160 (VHF Fallback - Analog)
- **Tags:** valley, fallback, analog, withdrawal, relay, terrain, survivability

## RF-005 - Legacy Patrol In Broken Hills

**User Prompt**

Evaluate an AN/PRC-77 legacy VHF net for a light infantry patrol moving through broken hills and sparse forest. I need a practical plan for maintaining comms during movement, limiting chatter to reduce geolocation risk, and deciding whether one static hilltop relay is enough.

- **Primary Radios:** AN/PRC-77 (VHF Analog - Legacy)
- **Tags:** hills, legacy, patrol, mobility, relay, emcon, vhf

## RF-006 - Armored Retrans Backbone

**User Prompt**

Use AN/VRC-90 SINCGARS sets to design a mounted retrans backbone for an armored battalion attacking across rolling steppe terrain. Determine where vehicle retrans should sit, how far forward to push them, and how to preserve coverage when the lead company outruns the main body.

- **Primary Radios:** AN/VRC-90 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** armor, mounted, retrans, sincgars, steppe, mobility, command

## RF-007 - Stryker Screen Net Resilience

**User Prompt**

Plan an AN/PRC-119 SINCGARS screen-line network for a cavalry troop screening in undulating terrain at night. Show likely communication gaps between scouts and troop HQ, then recommend retrans, antenna-height changes, or spacing adjustments that keep the net alive under EMCON.

- **Primary Radios:** AN/PRC-119 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** cavalry, screening, sincgars, terrain, night, retrans, emcon

## RF-008 - Urban Breach Team Control

**User Prompt**

Build an urban breach communications plan using AN/PRC-148 MBITR VHF LOS radios for assault, support, and breach elements operating on opposite sides of a dense block. Identify where building shadowing will cut the net and recommend rooftop or upper-floor relay options without overexposing the relay team.

- **Primary Radios:** AN/PRC-148 MBITR (VHF LOS)
- **Tags:** urban, breach, building, relay, rooftop, assault, vhf

## RF-009 - Dismounted Platoon SRW Spine

**User Prompt**

Plan a platoon assault network using AN/PRC-154 Rifleman radios in SRW across a dense urban district with alleyways, courtyards, and internal movement through buildings. Recommend spacing, relay behavior, and whether I should bias the mesh toward rooftops or interior stairwells to keep latency low.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform)
- **Tags:** urban, srw, mesh, platoon, low-latency, buildings, assault

## RF-010 - Littoral Raid Team Split Net

**User Prompt**

Design comms for a raid force splitting between beach, bluff, and inland objective using AN/PRC-163 VHF LOS and UHF LOS programs. Compare which waveform should carry command traffic on each leg, where a bluff-top relay belongs, and how to minimize exposure to enemy coastal DF.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-163 Falcon IV (UHF LOS - Tactical)
- **Tags:** littoral, coastal, vhf, uhf, relay, df, emcon, raid

## RF-011 - Ridge-To-Valley Company Fight

**User Prompt**

I need a company net plan using AN/PRC-152A and AN/PRC-163 radios for one platoon on the ridgeline and two platoons in the valley during a hasty attack. Tell me whether the valley force can stay on the same net, where retrans should go, and when to break the net into separate segments.

- **Primary Radios:** AN/PRC-152A Falcon III (VHF LOS - SINCGARS), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** ridge, valley, company, sincgars, retrans, terrain, attack

## RF-012 - Desert TOC Displacement Window

**User Prompt**

Plan communications continuity while a battalion TOC displaces across open desert using AN/PRC-117G and AN/VRC-90 sets. I need a movement timeline showing when retrans must leapfrog, what links will go degraded during displacement, and how to keep command traffic alive with minimal extra emitters.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net), AN/VRC-90 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** desert, displacement, toc, retrans, mobility, command, survivability

## RF-013 - Forested River Crossing Net

**User Prompt**

Build a communications plan for a river crossing in heavy forest using AN/PRC-119, AN/PRC-148, and AN/PRC-163 radios. Recommend relay sites for near bank, far bank, and bridgehead control, and show which nodes are most vulnerable to terrain and foliage masking during the crossing.

- **Primary Radios:** AN/PRC-119 SINCGARS (SINCGARS Frequency Hop), AN/PRC-148 MBITR (VHF LOS), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** river-crossing, forest, relay, vhf, command, mobility, terrain

## RF-014 - Arctic Patrol Net Under Low Power

**User Prompt**

Optimize a platoon patrol net in arctic terrain using AN/PRC-163 VHF and AN/PRC-152A VHF while keeping power as low as possible for EMCON. Recommend antenna height, spacing, and one contingency relay location if snow berms and rolling ground start breaking links.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-152A Falcon III (VHF LOS - SINCGARS)
- **Tags:** arctic, patrol, low-power, emcon, vhf, relay, terrain

## RF-015 - Convoy Through Canyon Country

**User Prompt**

Analyze convoy comms through canyon terrain using AN/PRC-117G, AN/PRC-119, and AN/VRC-90 radios. Show where the convoy will lose contact by segment, where a trail relay or overwatch retrans is mandatory, and which nodes are easiest for enemy intercept teams to target.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net), AN/PRC-119 SINCGARS (SINCGARS Frequency Hop), AN/VRC-90 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** convoy, canyon, retrans, intercept, mobility, vhf, terrain

## RF-016 - Urban Strongpoint Defense

**User Prompt**

Plan a defense of an urban strongpoint using AN/PRC-148 MBITR and AN/PRC-163 UHF LOS nets between rooftops, interior strongpoints, and a reserve element staged in a walled courtyard behind adjacent buildings. Recommend relay floors, antenna placement, and a power plan that limits exposure while keeping command and breach alarms reliable.

- **Primary Radios:** AN/PRC-148 MBITR (VHF LOS), AN/PRC-163 Falcon IV (UHF LOS - Tactical)
- **Tags:** urban, defense, rooftop, indoor, relay, power, emcon

## RF-017 - Hilltop Observation Post Support

**User Prompt**

Set up comms between a battalion CP, a hilltop observation post, and a mortar firing point using AN/PRC-152A, AN/PRC-163, and AN/PRC-117G radios. Determine whether one hilltop node can cover both missions or if I need a dedicated relay to keep fire-support traffic separated from command traffic.

- **Primary Radios:** AN/PRC-152A Falcon III (VHF LOS - SINCGARS), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-117G Falcon III (VHF Command Net)
- **Tags:** hilltop, op, fires, command, relay, separation, vhf

## RF-018 - Border Screen In Broken Desert

**User Prompt**

Design a long frontage border-screen network using AN/PRC-117G and AN/PRC-160 VHF fallback radios with limited relay assets. I need a conservative plan for patrol bases, retrans sites, and fallback voice paths when one relay is lost or jammed.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net), AN/PRC-160 (VHF Fallback - Analog)
- **Tags:** border, desert, relay, fallback, jamming, survivability, patrol

## RF-019 - Infiltration Through Karst Terrain

**User Prompt**

Evaluate whether a small infiltration team using AN/PRC-154 SRW and AN/PRC-148 VHF can stay connected while moving through karst ridges, sinkholes, and tree cover. Recommend when to stay on SRW mesh, when to switch to a higher relay node, and how to avoid creating an obvious RF signature.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), AN/PRC-148 MBITR (VHF LOS)
- **Tags:** infiltration, karst, srw, mesh, relay, emcon, mobility

## RF-020 - Mixed CPM-200 Fallback Scheme

**User Prompt**

Build a mixed fallback plan for a dispersed company using CPM-200 manpacks on VHF SINCGARS and HF voice during a prolonged disruption of higher networks. Recommend where to hold VHF nets, when to shift to HF, and how terrain and movement should drive the switch criteria.

- **Primary Radios:** CPM-200 Manpack (VHF SINCGARS), CPM-200 Manpack (HF Voice - NVIS)
- **Tags:** fallback, mixed-band, hf, vhf, company, terrain, mobility

## RF-021 - Ridge Line Retrans Under EW Pressure

**User Prompt**

Use AN/VRC-90 and AN/PRC-163 sets to plan a ridge-line retrans architecture while an enemy EW cell is searching for high-power emitters. Show the best tradeoff between retrans height, power, and survivability, and recommend alternates if the primary retrans site gets targeted.

- **Primary Radios:** AN/VRC-90 SINCGARS (SINCGARS Frequency Hop), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** ridge, retrans, ew, emcon, survivability, vhf, alternate

## RF-022 - Assault Net After Node Loss

**User Prompt**

I need a platoon and company comms plan using AN/PRC-154, AN/PRC-152A, and AN/PRC-163 for an assault where I expect one key node to be lost in the first hour. Show how to place leaders and relays so the network still functions after that loss, especially across built-up terrain.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), AN/PRC-152A Falcon III (VHF LOS - SINCGARS), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** assault, node-loss, survivability, urban, relay, mesh, command

## RF-023 - Rural Screen With Intermittent High Ground

**User Prompt**

Plan a rural screening mission using AN/PRC-119 and AN/PRC-148 radios where only a few pieces of high ground dominate a wide agricultural area. Identify the must-have terrain nodes, likely dead zones along movement routes, and which relay site should be prioritized if I only get one team.

- **Primary Radios:** AN/PRC-119 SINCGARS (SINCGARS Frequency Hop), AN/PRC-148 MBITR (VHF LOS)
- **Tags:** rural, screening, high-ground, relay, movement, vhf, terrain

## RF-024 - Dense City Reserve To Forward Link

**User Prompt**

Compare AN/PRC-163 UHF LOS and AN/PRC-148 VHF LOS for maintaining a reserve-to-forward-company link in a dense city with multistory concrete. Recommend the better band for command traffic, where to put a rooftop repeater or relay, and how to keep the reserve hidden from DF teams.

- **Primary Radios:** AN/PRC-163 Falcon IV (UHF LOS - Tactical), AN/PRC-148 MBITR (VHF LOS)
- **Tags:** city, concrete, vhf, uhf, rooftop, relay, df, command

## RF-025 - Battalion Fire Direction Continuity

**User Prompt**

Build a communications scheme for fire direction, battalion command, and observer traffic using AN/PRC-117G, AN/PRC-163, and AN/PRC-119 radios in hilly terrain. Recommend how to split nets, where retrans should sit, and how to keep fires traffic alive if the battalion TAC relocates suddenly.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-119 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** fires, battalion, hills, retrans, displacement, command, terrain

## RF-026 - Cold Weather Defense In Layered Terrain

**User Prompt**

Plan a cold-weather defense with AN/PRC-152A, AN/PRC-163, and AN/PRC-160 VHF fallback radios positioned across ridges, draws, and tree lines. I need primary, alternate, and emergency relay options plus a low-signature power plan for extended occupation.

- **Primary Radios:** AN/PRC-152A Falcon III (VHF LOS - SINCGARS), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-160 (VHF Fallback - Analog)
- **Tags:** cold-weather, defense, pace, relay, low-signature, terrain, fallback

## RF-027 - Bridge Seizure With Split Elements

**User Prompt**

Design comms for a bridge seizure where assault, support-by-fire, and blocking forces are separated by water, industrial structures, and elevated roadbeds. Use AN/PRC-163, AN/PRC-148, and AN/PRC-154 profiles and recommend which node should act as the primary relay during the decisive phase.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-148 MBITR (VHF LOS), AN/PRC-154 Rifleman Radio (Soldier Radio Waveform)
- **Tags:** bridge, seizure, assault, relay, urban, water, mixed-network

## RF-028 - Company Team In Broken Suburb

**User Prompt**

Build a company-team communications plan through broken suburban terrain using AN/PRC-119 and AN/VRC-90 for mounted command and AN/PRC-152A for dismounted elements. Show which mounted nodes should serve as retrans, how long the handoffs will hold during movement, and where coverage will collapse first.

- **Primary Radios:** AN/PRC-119 SINCGARS (SINCGARS Frequency Hop), AN/VRC-90 SINCGARS (SINCGARS Frequency Hop), AN/PRC-152A Falcon III (VHF LOS - SINCGARS)
- **Tags:** suburban, mounted, dismounted, retrans, handoff, mobility, command

## RF-029 - Observation Belt With Legacy Backup

**User Prompt**

Plan an observation belt using AN/PRC-163 as primary and AN/PRC-77 as emergency backup across a series of low ridges and shallow draws. Recommend how to position observation teams, which sites need relay support, and when the legacy set becomes useful versus dead weight.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), AN/PRC-77 (VHF Analog - Legacy)
- **Tags:** observation, legacy, backup, ridgeline, relay, terrain, emcon

## RF-030 - Command Post Retrans Layer

**User Prompt**

Use the Command Post Node SINCGARS retrans profile to support a brigade support area, a TAC node, and a forward logistics element in rolling terrain. I need a relay architecture that survives one node loss, minimizes unnecessary emissions, and keeps logistics and command traffic from stepping on each other.

- **Primary Radios:** Command Post Node (CP Node) (SINCGARS Retransmit)
- **Tags:** cp, retrans, brigade, logistics, survivability, emcon, rolling-terrain

## RF-031 - Dismounted Mesh In Dense City

**User Prompt**

Build a dense urban mesh using Silvus StreamCaster 4200 2.4 GHz nodes for assault teams, rooftop overwatch, and a casualty collection point. Recommend node spacing, best elevation choices, and whether I should add a single airborne relay to prevent mesh fragmentation inside deep concrete canyons.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz)
- **Tags:** urban, mesh, silvus, rooftop, airborne-relay, casualty, concrete

## RF-032 - High-Cap Mesh For Brigade ISR

**User Prompt**

Plan a high-capacity brigade ISR mesh with Silvus StreamCaster 4400 5.8 GHz radios carrying video from observation posts and vehicle scouts across broken ridgelines. Show how terrain and hop count affect throughput, and where to position relay nodes so the network keeps enough capacity for full-motion video.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap))
- **Tags:** mesh, high-bandwidth, isr, ridgeline, throughput, relay, video

## RF-033 - Wave Relay Convoy Screen

**User Prompt**

Use Persistent Systems Wave Relay MPU-5 radios to build a moving mesh for a convoy with escort vehicles, a UAV overwatch element, and a trailing recovery team. Recommend how many mesh layers I need, which nodes should be mobile relays, and what latency penalties to expect when the convoy stretches through hills.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz)
- **Tags:** convoy, mesh, uav, moving-network, latency, hills, relay

## RF-034 - FPV Repeater Chain Over Urban Rubble

**User Prompt**

Design an FPV repeater chain using AN/PRC-154 SRW for ground control and Silvus 4200 nodes as airborne repeaters over dense urban rubble. I need a plan that keeps drone control and downlink stable, avoids self-interference, and tells me how many airborne hops I can afford before latency becomes a problem.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz)
- **Tags:** fpv, airborne-relay, urban, rubble, mesh, latency, drone

## RF-035 - Forested Ridge Drone Relay Plan

**User Prompt**

Plan a forested ridgeline ISR network using Wave Relay MPU-5 nodes on teams and an FPV-style quadcopter repeater above the canopy. Recommend repeater orbit height, where to anchor the ground mesh, and how to keep the airborne relay from becoming the single point of failure.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz)
- **Tags:** forest, ridge, drone, airborne-relay, mesh, single-point-of-failure, isr

## RF-036 - Company Mesh With ANW2 Spur

**User Prompt**

Build a company attack mesh using AN/PRC-152A ANW2 radios for platoon leaders and AN/PRC-154 SRW for squads moving through mixed village and orchard terrain. Show how to bridge the two layers, where relay-capable leaders belong, and what happens if one platoon drops behind a ridgeline.

- **Primary Radios:** AN/PRC-152A Falcon III (ANW2 MANET), AN/PRC-154 Rifleman Radio (Soldier Radio Waveform)
- **Tags:** anw2, srw, mesh, village, orchard, bridging, relay

## RF-037 - Wideband Assault Backhaul

**User Prompt**

Use AN/PRC-117G Wideband ANW2 and CP Node wideband profiles to support a battalion assault with video, ATAK-style data, and command traffic across rolling terrain. Recommend where to place wideband backhaul nodes, how many hops are acceptable, and when to cut bandwidth-heavy traffic to preserve command latency.

- **Primary Radios:** AN/PRC-117G Falcon III (Wideband ANW2), Command Post Node (CP Node) (Wideband IP Backbone)
- **Tags:** wideband, backhaul, mesh, battalion, latency, video, terrain

## RF-038 - Tropos Mesh Over River Plain

**User Prompt**

Design a WIN-T Increment 2 Tropos MANET mesh linking a brigade TAC, an aviation support area, and a forward refuel site across a river plain with scattered tree lines. I need relay placement, expected hop count, and a plan for preserving throughput if one elevated node is lost.

- **Primary Radios:** WIN-T Increment 2 (JTRS/Ku) (Tropos MANET - Point of Presence)
- **Tags:** wint, tropos, mesh, river-plain, throughput, elevated-node, survivability

## RF-039 - FPV Retrans For Trench Assault

**User Prompt**

Build a trench-assault repeater concept using AN/PRC-154 SRW on assault squads, AN/PRC-163 SRW at platoon level, and a small airborne repeater node to bridge low ground. Recommend whether the repeater should loiter over friendly lines or over the objective edge, and how to reduce the chance of enemy geolocation.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** fpv, trench, airborne-relay, srw, low-ground, geolocation, assault

## RF-040 - Mountain Pass Mesh Ladder

**User Prompt**

Plan a mesh ladder through a mountain pass using Silvus 4400 nodes on vehicles, Wave Relay MPU-5 nodes with scouts, and one hilltop relay. Show which frequencies and placements best survive terrain masking, and estimate where latency or throughput will collapse if one hop degrades.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 4.9 GHz (Public Safety)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz)
- **Tags:** mountain-pass, mesh, relay, throughput, latency, scouts, terrain

## RF-041 - Urban ISR Bubble With Rooftop Relays

**User Prompt**

Use Silvus 4200 4.9 GHz nodes to build a rooftop-to-rooftop ISR mesh over a dense urban district while keeping dismounted teams connected at street level. Recommend rooftop relay density, expected NLOS penalties, and how to avoid a brittle design if two roofs become unusable.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz)
- **Tags:** urban, isr, rooftop, mesh, nlos, resilience, relay

## RF-042 - Airborne Wave Relay Over Marsh

**User Prompt**

Design a Wave Relay MANET plan across marshland and drainage canals where ground vehicles cannot hold continuous LOS. I need to know whether one airborne relay is enough, how to layer it with ground nodes, and how the network behaves if weather or EW forces the airborne platform down.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz)
- **Tags:** marsh, airborne-relay, mesh, weather, ew, contingency, canals

## RF-043 - Dismounted Mesh Under Jamming

**User Prompt**

Assess a dismounted SRW and ANW2 mesh under intermittent enemy jamming in dense woodland. Recommend node density, spacing changes, and relay posture that keep the network functional without creating obvious retrans beacons for enemy targeting.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), AN/PRC-152A Falcon III (ANW2 MANET)
- **Tags:** woodland, mesh, jamming, relay, emcon, spacing, survivability

## RF-044 - Cliffside FPV Control Corridor

**User Prompt**

Plan an FPV drone control corridor along a cliff-lined coast using Silvus 4200 airborne repeaters and Wave Relay ground nodes. Show the best locations for launch, recovery, and repeater orbit, and estimate which geometry keeps control latency stable while minimizing exposure to coastal EW sensors.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz)
- **Tags:** fpv, coast, cliff, airborne-relay, latency, ew, mesh

## RF-045 - Brigade Recon Multi-Tier Mesh

**User Prompt**

Build a multi-tier reconnaissance network using Silvus 4400 for high-capacity backhaul, MPU-5 for mobile nodes, and AN/PRC-154 for dismounted last-mile access. Recommend how to segment traffic, where to place the highest-capacity nodes, and which tier should absorb node loss first.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), AN/PRC-154 Rifleman Radio (Soldier Radio Waveform)
- **Tags:** recon, multi-tier, mesh, backhaul, node-loss, last-mile, bandwidth

## RF-046 - CP Wideband Displacement Mesh

**User Prompt**

Use CP Node wideband and AN/PRC-117G Wideband ANW2 to keep a brigade TAC and main CP linked during displacement through rolling wooded terrain. Recommend leapfrog relay positions, bandwidth priorities, and the minimum number of nodes needed to preserve a resilient mesh.

- **Primary Radios:** Command Post Node (CP Node) (Wideband IP Backbone), AN/PRC-117G Falcon III (Wideband ANW2)
- **Tags:** cp, displacement, wideband, mesh, woodland, relay, resilience

## RF-047 - FPV Repeater For Riverine Clearance

**User Prompt**

Build a repeater concept for FPV drones supporting riverbank clearance using AN/PRC-154 SRW controllers and an airborne Silvus relay above the tree line. Recommend altitude, orbit geometry, and fallback if enemy fire or weather forces the relay to shift mid-mission.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz)
- **Tags:** fpv, riverine, airborne-relay, tree-line, weather, fallback, drone

## RF-048 - Snow Valley Mesh Recovery

**User Prompt**

Plan how to recover a fragmented mesh in a snow-covered valley after two mobile nodes drop out. Use Wave Relay and Silvus profiles to recommend emergency relay placement, whether an airborne bridge is justified, and which links should be sacrificed first to preserve command traffic.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Silvus StreamCaster 4400 (MIMO 4x4 - 4.9 GHz (Public Safety))
- **Tags:** snow, valley, mesh, recovery, airborne-relay, command, survivability

## RF-049 - Edge Urban Penetration Mesh

**User Prompt**

Design a mesh for a penetration into a dense edge-city industrial belt using AN/PRC-163 SRW, AN/PRC-152A ANW2, and rooftop Silvus relays. Tell me how to place nodes for low-latency control, which roofs are worth holding, and where I should expect the first major throughput bottleneck.

- **Primary Radios:** AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio), AN/PRC-152A Falcon III (ANW2 MANET), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz)
- **Tags:** urban, industrial, mesh, rooftop, low-latency, throughput, relay

## RF-050 - Littoral Mesh With Drone Extension

**User Prompt**

Build a littoral mesh for boats, shore teams, and an inland control node using Wave Relay on mobile elements and one airborne repeater to bridge shoreline obstructions. Recommend where the airborne relay should bias, how many hops are acceptable, and what backup path to use if sea spray or EW reduces link quality.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz)
- **Tags:** littoral, mesh, airborne-relay, boats, ew, backup, hops

## RF-051 - ISR Video Mesh In Broken Desert

**User Prompt**

Use Silvus 4400 high-capacity nodes to move ISR video across broken desert ridgelines while keeping a separate low-latency command layer on AN/PRC-163 SRW. Recommend tiered placement, relay sites, and what traffic should be cut first if the mesh starts dropping below required throughput.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** desert, isr, video, mesh, throughput, command-layer, relay

## RF-052 - FPV Urban Canyon Handshake

**User Prompt**

Plan an FPV repeater stack through urban canyons where control packets originate on AN/PRC-154 SRW and pass through Wave Relay airborne nodes before reaching the strike drone. I need a practical recommendation on hop count, relay spacing, and what geometry best balances control reliability against enemy RF detection.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz)
- **Tags:** fpv, urban-canyon, airborne-relay, hops, detection, latency, mesh

## RF-053 - High Ground Mesh For Counter-Recon

**User Prompt**

Design a counter-recon mesh on dominant high ground using AN/PRC-152A ANW2, Silvus 4200, and CP Node wideband for battalion-level backhaul. Recommend where to harden the architecture, how to minimize single points of failure, and which nodes must stay hidden from enemy sensors.

- **Primary Radios:** AN/PRC-152A Falcon III (ANW2 MANET), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Command Post Node (CP Node) (Wideband IP Backbone)
- **Tags:** high-ground, counter-recon, mesh, backhaul, survivability, sensors, concealment

## RF-054 - Mountain ISR Bubble With Tropos

**User Prompt**

Build a WIN-T Tropos and Silvus relay architecture to support ISR, fires, and command across a mountain basin with only a few usable peaks. Show which peaks should host the mesh, where to add a UAV relay, and how to degrade gracefully if one summit node is lost.

- **Primary Radios:** WIN-T Increment 2 (JTRS/Ku) (Tropos MANET - Point of Presence), Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap))
- **Tags:** mountain, tropos, mesh, uav, peaks, graceful-degradation, isr

## RF-055 - Assault Mesh After EW Spike

**User Prompt**

Recommend how to reconfigure a dismounted assault mesh after an enemy EW burst disrupts several AN/PRC-154 and AN/PRC-163 SRW links in urban-fringe terrain. I need new relay priorities, guidance on whether to push an airborne repeater, and how to restore command first without flooding the spectrum.

- **Primary Radios:** AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** ew, urban-fringe, mesh, airborne-relay, recovery, command, spectrum

## RF-056 - NVIS For Basin Isolation

**User Prompt**

Plan an HF fallback architecture for units isolated in a mountain basin using AN/PRC-160 HF ALE NVIS and AN/PRC-160 HF Data STANAG profiles. Recommend which stations should hold NVIS versus data traffic, how to position antennas in limited terrain, and when to abandon LOS attempts entirely.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz), AN/PRC-160 HF ALE Manpack (HF Data - STANAG 4538)
- **Tags:** hf, nvis, basin, fallback, data, terrain, isolation

## RF-057 - Long-Haul HF For Cut-Off Battalion

**User Prompt**

Build a long-haul HF plan for a cut-off battalion using AN/PRC-160 HF ALE long-haul and legacy AN/PRC-160 HF skywave profiles. I need guidance on frequency selection, antenna orientation, and when to use NVIS versus long-haul to keep command traffic moving despite terrain isolation.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Long-Haul - 12-30 MHz), AN/PRC-160 (HF Long-Haul - Skywave)
- **Tags:** hf, long-haul, command, terrain-isolation, antenna, fallback, battalion

## RF-058 - HF Backstop For Arctic Patrols

**User Prompt**

Plan HF comms for arctic patrol bases using CPM-200 HF voice and AN/PRC-160 HF NVIS as backup to failed LOS nets. Recommend antenna layout, likely coverage windows, and how to split traffic between patrol updates and urgent command reports when weather shifts.

- **Primary Radios:** CPM-200 Manpack (HF Voice - NVIS), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** arctic, hf, nvis, patrol, weather, backup, command

## RF-059 - PSE-5 Long-Haul Lifeline

**User Prompt**

Use PSE-5 HF Pack Set profiles to create a 100 W long-haul and NVIS fallback plan for a brigade support area cut off by terrain and EW pressure. Show where to site antennas, which missions should stay on NVIS, and how to use power without making the site an easy DF target.

- **Primary Radios:** PSE-5 HF Pack Set (Long-Haul) (HF NVIS - 100 W), PSE-5 HF Pack Set (Long-Haul) (HF Long-Haul - 100 W)
- **Tags:** hf, pse5, brigade-support, nvis, long-haul, ew, df

## RF-060 - HF Data Bridge For Fragmented Force

**User Prompt**

Design an HF data bridge using AN/PRC-160 STANAG 4538 and AN/PRC-160 ALE profiles for a fragmented force spread across valleys and ridges. Recommend which nodes should carry data, what latency or throughput expectations are realistic, and how to preserve a voice emergency path.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Data - STANAG 4538), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** hf-data, voice, fragmented-force, valleys, ridges, latency, emergency

## RF-061 - NVIS During Brigade Displacement

**User Prompt**

Plan how HF should support brigade displacement when terrestrial retrans becomes unreliable. Use AN/PRC-160 HF NVIS and CPM-200 HF voice, and tell me which command elements should get HF first, where antennas can be hidden, and when the force should transition back to LOS nets.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz), CPM-200 Manpack (HF Voice - NVIS)
- **Tags:** brigade, displacement, hf, nvis, concealment, fallback, transition

## RF-062 - Island Defense HF Plan

**User Prompt**

Build an island defense fallback using PSE-5 long-haul HF and AN/PRC-160 HF NVIS for separated coastal batteries and a rear command element. Compare the usefulness of NVIS versus long-haul in littoral weather, and recommend how to preserve comms if SATCOM is denied.

- **Primary Radios:** PSE-5 HF Pack Set (Long-Haul) (HF Long-Haul - 100 W), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** island, littoral, hf, satcom-denied, long-haul, nvis, defense

## RF-063 - Emergency Voice Net In Dense Forest

**User Prompt**

Evaluate whether CPM-200 HF voice or AN/PRC-160 legacy HF NVIS is better for an emergency battalion voice net under dense forest canopy after the primary mesh collapses. Recommend antenna placement, expected reliability, and how terrain and foliage should change my site selection.

- **Primary Radios:** CPM-200 Manpack (HF Voice - NVIS), AN/PRC-160 (HF NVIS - Short Range)
- **Tags:** forest, hf, emergency, canopy, battalion, site-selection, fallback

## RF-064 - Remote Fires Coordination On HF

**User Prompt**

Create an HF plan for remote fires coordination using AN/PRC-160 HF data and PSE-5 NVIS as redundancy across mountainous terrain. I need guidance on which nodes should carry fire mission data, which should stay voice-only, and how to keep the net usable if ionospheric conditions deteriorate.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Data - STANAG 4538), PSE-5 HF Pack Set (Long-Haul) (HF NVIS - 100 W)
- **Tags:** fires, hf-data, mountains, redundancy, ionosphere, voice, nvis

## RF-065 - Denied-Spectrum HF PACE

**User Prompt**

Build a PACE architecture where HF becomes the emergency layer after VHF, mesh, and SATCOM are degraded by jamming. Use AN/PRC-160 HF ALE, CPM-200 HF voice, and PSE-5 long-haul, and recommend trigger points for transitioning each echelon onto HF.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz), CPM-200 Manpack (HF Voice - NVIS), PSE-5 HF Pack Set (Long-Haul) (HF Long-Haul - 100 W)
- **Tags:** pace, hf, jamming, emergency, echelon, transition, denied-spectrum

## RF-066 - Valley Isolation With Mixed HF Roles

**User Prompt**

Plan mixed HF roles for a company isolated in a deep valley with AN/PRC-160 long-haul, AN/PRC-160 NVIS, and CPM-200 VHF fallback available. Recommend which traffic stays local versus beyond-line-of-sight, and when a short VHF relay is still worth keeping active.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Long-Haul - 12-30 MHz), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz), CPM-200 Manpack (VHF SINCGARS)
- **Tags:** valley, hf, mixed-roles, local-vs-blos, vhf-relay, isolation, company

## RF-067 - HF Net For Border Outposts

**User Prompt**

Design an HF architecture for widely separated border outposts using PSE-5 and AN/PRC-160 HF ALE with terrain-driven isolation and sparse road access. Recommend antenna siting, primary versus alternate bands, and a realistic communications rhythm that reduces intercept opportunities.

- **Primary Radios:** PSE-5 HF Pack Set (Long-Haul) (HF NVIS - 100 W), AN/PRC-160 HF ALE Manpack (HF Long-Haul - 12-30 MHz)
- **Tags:** border, outposts, hf, terrain, intercept, antenna, rhythm

## RF-068 - Long-Haul HF During Coastal Storm

**User Prompt**

Assess how to maintain long-haul and emergency HF during a coastal storm using AN/PRC-160 and PSE-5 profiles after SATCOM becomes unreliable. Recommend which links should shift to NVIS, which should stay long-haul, and what antenna tradeoffs matter most in the littoral environment.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Long-Haul - 12-30 MHz), PSE-5 HF Pack Set (Long-Haul) (HF Long-Haul - 100 W)
- **Tags:** coastal, storm, hf, satcom-loss, nvis, long-haul, antenna

## RF-069 - Rear Command HF Shadow Net

**User Prompt**

Build a shadow command net on HF for a rear headquarters using AN/PRC-160 HF data and CPM-200 HF voice while the visible primary network stays on other systems. I want a low-profile backup that can carry critical reports if the main RF picture collapses or gets geolocated.

- **Primary Radios:** AN/PRC-160 HF ALE Manpack (HF Data - STANAG 4538), CPM-200 Manpack (HF Voice - NVIS)
- **Tags:** rear-hq, hf, shadow-net, backup, geolocation, low-profile, command

## RF-070 - Combined HF And Local VHF Screen

**User Prompt**

Design a local-security and long-reach plan using CPM-200 VHF SINCGARS for near control and AN/PRC-160 HF ALE for beyond-terrain reporting. Recommend which tasks belong on each layer, how to avoid overloading HF with local chatter, and what happens if one outpost loses its VHF relay.

- **Primary Radios:** CPM-200 Manpack (VHF SINCGARS), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** local-control, hf, vhf, outpost, relay, reporting, layered

## RF-071 - Mountain SATCOM Versus Terrain Net

**User Prompt**

Compare Starlink Standard and MUOS WCDMA for keeping a battalion TAC connected in mountain terrain where sky view is inconsistent and LOS nets keep breaking. Recommend which sites favor LEO versus GEO access, where terrain masks overhead coverage, and what fallback layer should backstop each position.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), MUOS Terminal (AN/USC-61) (MUOS WCDMA - Narrowband)
- **Tags:** satcom, mountain, leo, geo, sky-view, fallback, battalion

## RF-072 - Hybrid SATCOM For Urban Command Cell

**User Prompt**

Plan a hybrid architecture for an urban command cell using PRC-163 MUOS SATCOM, Starshield, and local SRW mesh. I need guidance on what traffic rides each layer, which rooftops or courtyards can support satellite access, and how to preserve command if enemy EW starts hunting the highest-value emitters.

- **Primary Radios:** AN/PRC-163 Falcon IV (MUOS SATCOM - WCDMA), Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil)), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** hybrid, satcom, urban, rooftop, ew, command, mesh

## RF-073 - WIN-T Ku Backbone In Open Desert

**User Prompt**

Use WIN-T Ku-band SATCOM and Tropos MANET to build a brigade backbone across open desert with long vehicle separations. Recommend where the Ku terminals should sit, when Tropos should absorb traffic locally, and how to keep the architecture working if one SATCOM node goes dark.

- **Primary Radios:** WIN-T Increment 2 (JTRS/Ku) (WIN-T Ku-band SATCOM), WIN-T Increment 2 (JTRS/Ku) (Tropos MANET - Point of Presence)
- **Tags:** wint, satcom, desert, backbone, brigade, redundancy, tropos

## RF-074 - MUOS For Deep Forest Operations

**User Prompt**

Assess the usefulness of MUOS terminals and PRC-117G UHF SATCOM DAMA for deep forest operations where canopy, ridge lines, and movement all constrain geometry. Recommend where to use the satellite layer, which sites need clear sky arcs, and what terrestrial fallback should stay in reserve.

- **Primary Radios:** MUOS Terminal (AN/USC-61) (MUOS WCDMA - Narrowband), AN/PRC-117G Falcon III (UHF SATCOM DAMA)
- **Tags:** muos, forest, canopy, geometry, satcom, fallback, movement

## RF-075 - Starshield For Mobile Fires Cell

**User Prompt**

Plan a low-latency backbone for a mobile fires cell using Starshield as primary, PRC-117G as alternate, and AN/PRC-160 HF as emergency. I need a hybrid terrestrial-space-HF design that survives movement between hides, preserves rapid coordination, and limits the RF signature of the highest-value node.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil)), AN/PRC-117G Falcon III (UHF SATCOM DAMA), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** hybrid, fires, starshield, satcom, hf, movement, emcon

## RF-076 - Littoral Joint Force PACE

**User Prompt**

Build a PACE plan for a littoral operation using Starlink Standard, MUOS WCDMA, and Wave Relay near-shore mesh. Recommend which functions stay on LEO SATCOM, which belong on MUOS, and how to transition to the mesh if overhead access becomes intermittent or jammed.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), MUOS Terminal (AN/USC-61) (MUOS WCDMA - Narrowband), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz)
- **Tags:** littoral, pace, leo, muos, mesh, jamming, transition

## RF-077 - Battalion CP Hybrid Resilience

**User Prompt**

Design a battalion CP architecture using CP Node wideband, Starshield, and AN/PRC-160 HF ALE so the command post can survive terrain masking, satellite degradation, and loss of one backbone node. Show which paths should be primary, alternate, and emergency for command, logistics, and ISR reporting.

- **Primary Radios:** Command Post Node (CP Node) (Wideband IP Backbone), Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil)), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** cp, hybrid, resilience, satcom, hf, backbone, pace

## RF-078 - GEO Versus LEO In Mountain Winter

**User Prompt**

Compare MUOS and Starlink for a winter mountain operation with snow-packed valleys, limited road movement, and intermittent sky view. Recommend where each system is practical, how terrain changes the access plan, and what local relay or HF layer should bridge the blind spots.

- **Primary Radios:** MUOS Terminal (AN/USC-61) (MUOS WCDMA - Narrowband), Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** winter, mountain, geo-vs-leo, sky-view, relay, hf, terrain

## RF-079 - PRC-163 MUOS For Raid Force

**User Prompt**

Plan communications for a dispersed raid force using PRC-163 MUOS SATCOM, PRC-163 SRW, and PRC-148 local VHF. I need a layered design that keeps assault teams connected locally, preserves beyond-line-of-sight reporting, and minimizes the chance that one exposed SATCOM user compromises the whole mission.

- **Primary Radios:** AN/PRC-163 Falcon IV (MUOS SATCOM - WCDMA), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio), AN/PRC-148 MBITR (VHF LOS)
- **Tags:** raid, muos, layered, local-and-blos, emcon, assault, satcom

## RF-080 - Wide Area Sustainment Network

**User Prompt**

Use WIN-T Ku SATCOM, CP Node wideband, and AN/PRC-117G Wideband ANW2 to support sustainment convoys and logistics sites over a wide operational area. Recommend where the high-capacity links should sit, how to keep routing efficient, and what the fallback should be if the SATCOM layer is partially denied.

- **Primary Radios:** WIN-T Increment 2 (JTRS/Ku) (WIN-T Ku-band SATCOM), Command Post Node (CP Node) (Wideband IP Backbone), AN/PRC-117G Falcon III (Wideband ANW2)
- **Tags:** sustainment, logistics, wide-area, satcom, wideband, routing, fallback

## RF-081 - Edge Battlefield Satellite Mix

**User Prompt**

Build a modern battlefield architecture mixing Starshield, MUOS, and Silvus backhaul for a command cell supporting drones, fires, and maneuver. Recommend what traffic belongs on each system, how to place the terrestrial backhaul in terrain, and which layer should take the hit first if EW pressure rises.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil)), MUOS Terminal (AN/USC-61) (MUOS WCDMA - Narrowband), Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap))
- **Tags:** modern, satellite-mix, fires, drones, ew, backhaul, command

## RF-082 - SATCOM For Displacing Brigade Main

**User Prompt**

Plan how a displacing brigade main should use Starlink, WIN-T Ku SATCOM, and HF fallback while moving between two terrain-constrained sites. Show when each terminal should be active, how to avoid losing connectivity during teardown and setup, and which traffic can tolerate latency or short outages.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), WIN-T Increment 2 (JTRS/Ku) (WIN-T Ku-band SATCOM), AN/PRC-160 HF ALE Manpack (HF Long-Haul - 12-30 MHz)
- **Tags:** brigade-main, displacement, satcom, hf, latency, movement, continuity

## RF-083 - GEO Fallback For Denied LEO

**User Prompt**

Design a communications fallback if LEO SATCOM becomes denied or unreliable, using PRC-117G UHF DAMA, MUOS terminal, and CP Node terrestrial backhaul. Recommend which command functions degrade gracefully to GEO, where terrestrial relays must compensate, and how terrain changes the fallback map.

- **Primary Radios:** AN/PRC-117G Falcon III (UHF SATCOM DAMA), MUOS Terminal (AN/USC-61) (MUOS Legacy UHF DAMA), Command Post Node (CP Node) (Wideband IP Backbone)
- **Tags:** geo-fallback, denied-leo, satcom, backhaul, terrain, command, relay

## RF-084 - Hybrid Network For Counter-Drone Fight

**User Prompt**

Build a hybrid network for a counter-drone fight using Starshield for high-rate backhaul, PRC-163 SRW for dismounted local control, and Silvus for relay between sensor and shooter nodes. Recommend placement and traffic priorities that preserve low latency while reducing exposure to enemy geolocation.

- **Primary Radios:** Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil)), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio), Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz)
- **Tags:** counter-drone, hybrid, low-latency, geolocation, backhaul, mesh, modern

## RF-085 - Command Mesh With Space And HF

**User Prompt**

Design a three-layer architecture with CP Node wideband on the ground, Starlink overhead, and AN/PRC-160 HF as the emergency layer for a dispersed command network in mountain-fringe terrain. I need a clear PACE scheme, recommended node placement, and failure behavior if the main relay summit is lost.

- **Primary Radios:** Command Post Node (CP Node) (Wideband IP Backbone), Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** three-layer, pace, mountain-fringe, satcom, hf, relay-loss, command

## RF-086 - Military To Public Safety Gateway

**User Prompt**

Plan an interoperability scheme between a battalion using AN/PRC-163 and a host-nation emergency service using P25 portable and P25 repeater systems in a damaged urban area. Recommend where the gateway or liaison node should sit, how to avoid interference, and what traffic should stay off the shared net.

- **Primary Radios:** AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), P25 Portable (generic) (P25 Phase 1 VHF), P25 Repeater (VHF Repeater)
- **Tags:** interoperability, p25, urban, gateway, host-nation, interference, repeater

## RF-087 - Convoy Support With P25 Mobile Relay

**User Prompt**

Use P25 mobile and P25 repeater assets to support a military convoy moving through suburban terrain while preserving a bridge to military command nets. Recommend where the repeater belongs, how long the convoy can stay in coverage, and what handoff issues appear when the vehicles move behind urban clutter.

- **Primary Radios:** P25 Mobile (generic) (P25 VHF Mobile), P25 Repeater (VHF Repeater)
- **Tags:** convoy, suburban, p25, repeater, handoff, mobility, interoperability

## RF-088 - DMR Repeater For Base Defense

**User Prompt**

Design a DMR repeater and portable/mobile plan for a rear-area base defense force operating around warehouses, berms, and access roads. Recommend repeater height, coverage expectations, and how to separate security traffic from logistics traffic while still allowing emergency crossover.

- **Primary Radios:** DMR Portable (Tier II) (DMR UHF Direct), DMR Mobile (Tier II) (DMR UHF Mobile), DMR Repeater (Tier III) (DMR Trunked Repeater)
- **Tags:** dmr, base-defense, rear-area, repeater, logistics, security, coverage

## RF-089 - Mixed P25 And LTE Incident Net

**User Prompt**

Build a joint incident net using Harris XG-100P P25/LTE and Broadband LTE FirstNet profiles to support a military support-to-civil-authority mission after a strike on critical infrastructure. Recommend where LTE helps, where it becomes fragile, and how to keep a resilient P25 fallback if towers or backhaul fail.

- **Primary Radios:** Harris XG-100P (P25/LTE) (P25 UHF), Broadband LTE (FirstNet) (FirstNet Band 14 (700 MHz))
- **Tags:** lte, p25, joint, infrastructure, fallback, resilience, civil-support

## RF-090 - DMR And Military Liaison At Port

**User Prompt**

Plan interoperability between a port-security element on MOTOTRBO R7 and DMR repeater networks and a military command node using PRC-117G. Recommend gateway placement, likely interference points in the port environment, and how to keep shared coordination traffic available without merging both networks completely.

- **Primary Radios:** Motorola MOTOTRBO R7 (DMR VHF), DMR Repeater (Tier III) (DMR Trunked Repeater), AN/PRC-117G Falcon III (VHF Command Net)
- **Tags:** port, dmr, interoperability, gateway, interference, military-civil, command

## RF-091 - Legacy P25 Mutual Aid Pocket

**User Prompt**

Assess how Motorola XTS 2500 handhelds and a P25 repeater can support a small mutual-aid pocket inside a larger military area of operations. Recommend where the repeater belongs, what terrain or building limits matter most, and how to maintain emergency connectivity if the repeater is lost.

- **Primary Radios:** Motorola XTS 2500 (P25) (P25 Phase 1 UHF), P25 Repeater (VHF Repeater)
- **Tags:** p25, mutual-aid, repeater-loss, terrain, building, emergency, support

## RF-092 - Analog Fallback In Joint Response

**User Prompt**

Design a joint-response communications fallback using MOTOTRBO R7 analog/P25 fallback and military AN/PRC-163 VHF in a damaged industrial area. Recommend how to separate nets, where to put a liaison relay or repeater, and what tasks should be coordinated across the seam.

- **Primary Radios:** Motorola MOTOTRBO R7 (P25 / Analog Fallback), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** analog, p25, liaison, industrial, relay, joint-response, seam

## RF-093 - Civil-Military Search Corridor

**User Prompt**

Plan a search-and-rescue style corridor using Harris XG-100P, P25 mobile, and AN/PRC-152A in broken suburban and wooded terrain. Recommend gateway placement, likely dead zones, and how to keep the civil side interoperable without overloading the military net.

- **Primary Radios:** Harris XG-100P (P25/LTE) (P25 UHF), P25 Mobile (generic) (P25 VHF Mobile), AN/PRC-152A Falcon III (VHF LOS - SINCGARS)
- **Tags:** search, suburban, wooded, gateway, dead-zones, interoperability, military-civil

## RF-094 - Rear Medical Net With Legacy Radios

**User Prompt**

Build a rear-area medical evacuation comms plan using Motorola XTS 2500, P25 portable, and one DMR mobile link around a field hospital and evacuation route. Recommend repeater or mobile relay use, likely coverage holes around structures, and how to preserve emergency traffic under congestion.

- **Primary Radios:** Motorola XTS 2500 (P25) (P25 Phase 1 VHF), P25 Portable (generic) (P25 Phase 1 UHF), DMR Mobile (Tier II) (DMR UHF Mobile)
- **Tags:** medevac, rear-area, p25, dmr, relay, congestion, field-hospital

## RF-095 - LTE And Mesh For Rear Security

**User Prompt**

Compare Broadband LTE FirstNet and Wave Relay MPU-5 for rear-area security patrols around a wide installation with warehouses, berms, and intermittent tower support. Recommend which layer should carry routine reporting, what the repeater or mesh plan should be when LTE becomes spotty, and how to keep emergency alerts immediate.

- **Primary Radios:** Broadband LTE (FirstNet) (FirstNet Band 14 (700 MHz)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz)
- **Tags:** rear-security, lte, mesh, installation, repeater, reporting, emergency

## RF-096 - Homeland Defense Airfield Net

**User Prompt**

Design an airfield defense communications plan mixing AN/PRC-117G, AN/PRC-163, P25 mobile, and FirstNet LTE around runways, fuel farms, and hangars. Recommend where interoperability should happen, how to cover the far runway ends, and what backup survives if commercial support degrades.

- **Primary Radios:** AN/PRC-117G Falcon III (VHF Command Net), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), P25 Mobile (generic) (P25 VHF Mobile), Broadband LTE (FirstNet) (FirstNet Band 14 (700 MHz))
- **Tags:** homeland-defense, airfield, interoperability, lte, backup, runways, command

## RF-097 - Port Security With Space Backhaul

**User Prompt**

Build a port-security command architecture using MOTOTRBO R7 for local teams, CP Node wideband for on-site backhaul, and Starlink for reachback. I need a practical recommendation on relay placement, how to keep containers and cranes from breaking the RF picture, and what fallback remains if the satellite layer degrades.

- **Primary Radios:** Motorola MOTOTRBO R7 (DMR VHF), Command Post Node (CP Node) (Wideband IP Backbone), Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band))
- **Tags:** port-security, backhaul, starlink, dmr, relay, cranes, fallback

## RF-098 - Border Support To Civil Authorities

**User Prompt**

Plan a border support mission using AN/PRC-152A, Harris XG-100P, and P25 repeater coverage in rugged desert terrain with sparse infrastructure. Recommend where to put shared gateways, how to handle terrain-driven blind spots, and which traffic should remain purely military for security reasons.

- **Primary Radios:** AN/PRC-152A Falcon III (VHF LOS - SINCGARS), Harris XG-100P (P25/LTE) (P25 UHF), P25 Repeater (VHF Repeater)
- **Tags:** border, desert, civil-authorities, gateway, blind-spots, security, repeater

## RF-099 - Rear Logistics Hub Under Drone Threat

**User Prompt**

Design a rear logistics hub communications plan using DMR repeater for local security, AN/PRC-163 for military command, and Starshield for reachback while under persistent drone threat. Recommend power, placement, and relay posture that preserve command and warning traffic but keep the RF signature manageable.

- **Primary Radios:** DMR Repeater (Tier III) (DMR Trunked Repeater), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS), Starlink / Starshield LEO SATCOM (Starshield (Ka-band - Gov/Mil))
- **Tags:** rear-logistics, drone-threat, dmr, satcom, emcon, warning, command

## RF-100 - Joint Harbor Evacuation And Defense

**User Prompt**

Build a joint harbor evacuation and defense comms plan using P25 mobile and portable assets, PRC-117G command radios, Starlink backhaul, and AN/PRC-160 HF as emergency fallback. I need a full layered architecture that handles congestion, terrain and infrastructure masking, interoperability, and loss of one major node without collapsing.

- **Primary Radios:** P25 Mobile (generic) (P25 VHF Mobile), P25 Portable (generic) (P25 Phase 1 VHF), AN/PRC-117G Falcon III (VHF Command Net), Starlink / Starshield LEO SATCOM (Starlink Standard (Ku-band)), AN/PRC-160 HF ALE Manpack (HF NVIS - ALE 2-12 MHz)
- **Tags:** harbor, joint, layered, interoperability, congestion, node-loss, hf

## RF-101 - Urban FPV Control Link Through Concrete Canyons

**User Prompt**

Plan an FPV strike-control architecture in a dense city using ExpressLRS at 915 MHz for command/control, analog 5.8 GHz video, and one rooftop repeater. Show where concrete canyons will break either leg first, whether the repeater should sit on the launch building or one block forward, and how to keep the control link more robust than the video link.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Rooftop FPV Repeater (915 MHz / 5.8 GHz)
- **Tags:** fpv, urban, 915mhz, 5.8ghz, repeater, rooftop, concrete

## RF-102 - Trench Assault FPV Repeater Bubble

**User Prompt**

Design an FPV support plan for a trench assault using ExpressLRS at 868 MHz, 1.2 GHz digital video, and a small mast repeater behind the line. Recommend mast height, offset from the trench line, and what distance the repeater should stay back so it preserves link margin without becoming an obvious target.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Mast FPV Repeater (868 MHz / 1.2 GHz)
- **Tags:** fpv, trench, 868mhz, 1.2ghz, mast, repeater, assault

## RF-103 - Ridge Crest FPV Overwatch Relay

**User Prompt**

Build a mountain overwatch FPV architecture using Crossfire at 915 MHz, analog 5.8 GHz video, and a ridgeline repeater quad. Determine whether the relay should orbit on the military crest or reverse slope, how much altitude it needs above the ridge, and which terrain folds will still block the return video path.

- **Primary Radios:** TBS Crossfire Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, mountain, ridgeline, airborne-relay, 915mhz, 5.8ghz, overwatch

## RF-104 - Forest Canopy Penetration For FPV Teams

**User Prompt**

Assess an FPV network moving under heavy canopy using 433 MHz control, 1.3 GHz video, and one hover relay above the tree line. Recommend when the lower-frequency control link justifies the antenna penalty, what altitude the relay must hold above the canopy, and how to avoid making the relay the single point of failure.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Airborne FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, forest, canopy, 433mhz, 1.3ghz, relay, single-point-of-failure

## RF-105 - Desert Berm Hopping FPV Net

**User Prompt**

Plan FPV coverage across desert berms and wadis using 915 MHz control, 5.8 GHz video, and a vehicle-mounted retractable repeater mast. Show which berm lines are worth occupying, how high the mast needs to be to clear the dominant folds, and when the team should reposition the mast instead of increasing power.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Vehicle FPV Repeater Mast (915 MHz / 5.8 GHz)
- **Tags:** fpv, desert, berms, mast, vehicle-relay, 915mhz, 5.8ghz

## RF-106 - Industrial Plant FPV Through Steel Clutter

**User Prompt**

Design an FPV repeater layout for an industrial plant with tanks, steel framing, and pipe racks using 868 MHz control, 2.4 GHz video, and a rooftop relay. Recommend which frequency leg is most vulnerable to reflections, where the relay should sit relative to the highest metal structures, and how to preserve low latency for breach support.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Rooftop FPV Repeater (868 MHz / 2.4 GHz)
- **Tags:** fpv, industrial, steel, reflections, 868mhz, 2.4ghz, rooftop

## RF-107 - Littoral Bluff To Beach FPV Chain

**User Prompt**

Build an FPV relay chain from a bluff-top launch point to a beach assault zone using 915 MHz control and 5.8 GHz video. Compare a single bluff-edge relay against two lower-power airborne relays, and recommend the better architecture when sea clutter and bluff shadowing both matter.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, littoral, bluff, beach, sea-clutter, airborne-relay, 5.8ghz

## RF-108 - Suburban Block Clearing FPV Ladder

**User Prompt**

Plan a suburban clearing operation that uses handheld FPV controllers at 915 MHz, 5.8 GHz analog video, and a laddered relay plan from garage roof to school roof to water tower. Show where each relay node should be placed, which one is most likely to be cut by building shadow, and how to keep command/control resilient when one relay is lost.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Fixed FPV Relay Nodes (915 MHz / 5.8 GHz)
- **Tags:** fpv, suburban, relay-chain, 915mhz, 5.8ghz, building-shadow, node-loss

## RF-109 - Night FPV Under EMCON Limits

**User Prompt**

Optimize a night FPV support package using 868 MHz control and 1.2 GHz video under strict EMCON. Recommend the lowest practical power plan, where a passive-looking relay should sit, and whether it is better to shorten the forward leg or hold the relay higher and further back.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Low-Power FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, night, emcon, low-power, 868mhz, 1.2ghz, relay

## RF-110 - River Bend FPV Crossing Support

**User Prompt**

Design FPV support for a river crossing where the launch team is masked by tree lines and the far bank rises sharply. Use 915 MHz control, 5.8 GHz video, and one quad repeater, then recommend orbit point, altitude, and whether a second far-bank relay would materially improve link reliability.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, river-crossing, airborne-relay, tree-line, 915mhz, 5.8ghz, far-bank

## RF-111 - Mountain Switchback Convoy FPV Scout

**User Prompt**

Plan an FPV scout architecture for a convoy moving on mountain switchbacks using 433 MHz control, 1.3 GHz video, and a lead vehicle relay mast. Recommend how far ahead the mast vehicle can move before the rear command vehicle loses the return path, and when an airborne relay is mandatory instead of another ground mast.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Vehicle FPV Repeater Mast (433 MHz / 1.3 GHz)
- **Tags:** fpv, convoy, mountain, switchbacks, 433mhz, 1.3ghz, vehicle-relay

## RF-112 - Rail Yard FPV Breach Over Long Steel Lines

**User Prompt**

Assess how FPV teams should operate in a rail yard using 915 MHz control and 5.8 GHz video when long steel lines create deep shadow and multipath. Recommend relay tower placement, the best launch sector, and whether staggered low-altitude relays are better than one high relay over the center of the yard.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Tower FPV Repeater (915 MHz / 5.8 GHz)
- **Tags:** fpv, rail-yard, multipath, relay-tower, 915mhz, 5.8ghz, breach

## RF-113 - Quarry Wall FPV Dead Ground Recovery

**User Prompt**

Build an FPV support concept around quarry walls and pits using 868 MHz control, 2.4 GHz video, and one loitering repeater drone. Show where dead ground forms for both links, where the repeater should loiter to keep a stable geometry, and how much margin to preserve before descending into the pit.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Airborne FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, quarry, dead-ground, 868mhz, 2.4ghz, loiter-relay, geometry

## RF-114 - Urban Interior Courtyard FPV Access

**User Prompt**

Design a control plan for FPVs entering deep interior courtyards using 915 MHz control, 5.8 GHz video, and a rooftop repeater team. Recommend the best roof edge, how much standoff the repeater needs from the courtyard opening, and whether the courtyard can be serviced without a second relay inside the block.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Rooftop FPV Repeater (915 MHz / 5.8 GHz)
- **Tags:** fpv, courtyard, urban, rooftop, 915mhz, 5.8ghz, interior-block

## RF-115 - Snow Valley FPV Link Preservation

**User Prompt**

Plan winter FPV operations in a snow valley using 915 MHz control and 1.2 GHz video with a sled-mounted mast repeater. Show where snow berms and valley bends break the links, what mast height is realistic on the sled, and when an airborne relay becomes more survivable than a bright static mast in open snow.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Digital FPV Video Downlink (1.2 GHz), Sled FPV Repeater Mast (915 MHz / 1.2 GHz)
- **Tags:** fpv, snow, valley, mast, 915mhz, 1.2ghz, winter

## RF-116 - Low Altitude FPV Relay Versus High Orbit Tradeoff

**User Prompt**

Compare a low-altitude close-in relay against a higher rearward orbit for FPV teams using 868 MHz control and 5.8 GHz video in rolling terrain. I need a recommendation on which geometry minimizes latency and link drops while reducing the chance that the relay is seen and targeted.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (868 MHz / 5.8 GHz)
- **Tags:** fpv, relay-geometry, rolling-terrain, latency, 868mhz, 5.8ghz, survivability

## RF-117 - Forward Arming Point FPV Deconfliction

**User Prompt**

Build an FPV support picture around a forward arming and refuel point using multiple 915 MHz control links and multiple 5.8 GHz video channels. Recommend channelization, separation, and relay locations so simultaneous launches do not crush each other while still supporting quick turn sorties.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), FPV Relay Nodes (915 MHz / 5.8 GHz)
- **Tags:** fpv, farp, deconfliction, 915mhz, 5.8ghz, multi-sortie, relay

## RF-118 - Village Edge FPV Ambush Support

**User Prompt**

Plan an FPV ambush support package at the edge of a village using 433 MHz control, 1.3 GHz video, and a concealed relay behind a treeline. Show how far the relay should be from the launch team, what antenna orientation matters most, and where the village structures will still break the video path.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Concealed FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, village, ambush, treeline, 433mhz, 1.3ghz, concealed-relay

## RF-119 - Coastal Port FPV Through Cranes

**User Prompt**

Design an FPV relay scheme for port operations with container stacks and cranes using 915 MHz control and 5.8 GHz video. Recommend whether the best relay location is on a crane, on a warehouse roof, or airborne over the quay, and explain which option best handles moving steel obstructions.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Port FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, port, cranes, steel-obstructions, 915mhz, 5.8ghz, relay

## RF-120 - Dual Team FPV Relay Handover

**User Prompt**

Plan a handover scheme for two FPV teams sharing one relay with 868 MHz control and 2.4 GHz video. Show when handoff timing becomes risky, whether the relay should bias toward the outgoing or incoming aircraft, and how to avoid a temporary control gap during target area turnover.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Shared Airborne FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, handoff, 868mhz, 2.4ghz, shared-relay, turnover, control-gap

## RF-121 - Silvus Urban Mesh For FPV Launch Teams

**User Prompt**

Build a Silvus StreamCaster 4200 2.4 GHz mesh linking an FPV launch team, rooftop observers, and a command post across a dense city. Show where the mesh nodes should sit, how many hops are acceptable before control/video latency becomes a problem, and whether one rooftop relay node is enough to keep the launch team hidden.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** silvus, mesh, fpv, urban, 2.4ghz, hops, rooftop

## RF-122 - Silvus 4.9 GHz Village Assault Backbone

**User Prompt**

Plan a 4.9 GHz Silvus StreamCaster 4200 backbone for a village assault carrying FPV observer traffic, ATAK-style data, and voice. Recommend mast or rooftop placement, expected hop count, and where throughput collapses first if one key node falls behind a ridgeline.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio), FPV Observer Payload (5.8 GHz Video)
- **Tags:** silvus, 4.9ghz, village, backbone, fpv, throughput, ridgeline

## RF-123 - High Capacity Silvus 5.8 GHz ISR Spine

**User Prompt**

Design a Silvus StreamCaster 4400 5.8 GHz spine for ISR teams feeding multiple rooftop cameras and FPV overwatch video into a battalion TAC. Show how many relay hops the network can sustain before video quality or latency becomes unacceptable, and where to place the highest-capacity nodes.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Rooftop ISR Camera Link (5.8 GHz), Command Post Node (CP Node) (Wideband IP Backbone)
- **Tags:** silvus, 5.8ghz, isr, high-capacity, video, hops, tac

## RF-124 - Silvus Mesh Across Broken Orchard Terrain

**User Prompt**

Use Silvus 4200 2.4 GHz nodes to support platoon movement through orchards, walls, and irrigation cuts. Recommend node spacing, relay height, and whether a small airborne bridge is justified to keep the mesh stable for FPV observers and leader traffic.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), AN/PRC-154 Rifleman Radio (Soldier Radio Waveform), Airborne Mesh Bridge (2.4 GHz)
- **Tags:** silvus, orchard, mesh, airborne-bridge, 2.4ghz, fpv, spacing

## RF-125 - Silvus Wideband Retrans On Reverse Slope

**User Prompt**

Assess whether Silvus 4400 2.4 GHz nodes can support a reverse-slope retrans concept that protects the command node from direct observation while still carrying FPV reconnaissance and C2 traffic. Recommend exact placement relative to the crest and explain the tradeoff between survivability and link angle.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), FPV Observer Feed (5.8 GHz), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** silvus, reverse-slope, retrans, 2.4ghz, survivability, command, fpv

## RF-126 - Silvus Mesh For Counter-Drone Screen

**User Prompt**

Build a counter-drone screen using Silvus 4200 4.9 GHz nodes between radar pickets, interceptor teams, and a command post. I need a mesh design that keeps low latency for track handoff, identifies the highest-value relay nodes, and shows what terrain gaps force either another node or a higher mast.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Counter-UAS Sensor Link (4.9 GHz), Command Post Node (CP Node) (Wideband IP Backbone)
- **Tags:** silvus, counter-drone, 4.9ghz, low-latency, mesh, mast, pickets

## RF-127 - Silvus Bridge For Riverine Teams

**User Prompt**

Design a Silvus 4200 2.4 GHz mesh bridging both banks of a river for boat teams, shoreline observers, and FPV scouts. Recommend which bank should host the primary relay, how high that node needs to sit above reeds and embankments, and when a floating or airborne relay is worth the risk.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Boat Team Data Link (2.4 GHz), FPV Scout Link (5.8 GHz)
- **Tags:** silvus, riverine, 2.4ghz, relay, boat-team, fpv, embankment

## RF-128 - Silvus 5.8 GHz Rooftop To Rooftop Fight

**User Prompt**

Plan a rooftop-to-rooftop fight using Silvus 4400 5.8 GHz nodes across a dense district. Show where Fresnel clearance over the streets matters, how much throughput is lost per hop, and whether one lower rooftop relay can preserve enough capacity when the highest tower is denied.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Rooftop Observation Link (5.8 GHz), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** silvus, rooftop, 5.8ghz, throughput, hops, urban, denied-node

## RF-129 - Silvus Mesh For Mobile Assault Breach

**User Prompt**

Use Silvus 4200 4.9 GHz nodes on assault vehicles and breach teams to carry video, engineer reporting, and command traffic during a breach lane operation. Recommend where the mobile relay vehicle should sit, how fast the convoy can move before the mesh frays, and which segment should be sacrificed first under jamming.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Vehicle Breach Data Link (4.9 GHz), AN/VRC-90 SINCGARS (SINCGARS Frequency Hop)
- **Tags:** silvus, breach, mobility, 4.9ghz, mesh, jamming, assault

## RF-130 - Silvus Mesh In Snowbound Mountain Village

**User Prompt**

Design a Silvus 4200 2.4 GHz mesh for teams operating in a snowbound mountain village with steep roofs, gullies, and rock spurs. I need relay placement, node spacing, and a recommendation on whether one airborne bridge is better than two static rooftop nodes in that terrain.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Airborne Mesh Bridge (2.4 GHz), FPV Observer Feed (5.8 GHz)
- **Tags:** silvus, winter, mountain-village, 2.4ghz, airborne-bridge, rooftop, relay

## RF-131 - Silvus ISR Corridor Along Highway Cut

**User Prompt**

Plan a Silvus 4400 2.4 GHz ISR corridor along a highway cut with teams on overpasses and in the low ground. Show where cut walls create non-line-of-sight breaks, how to route around them, and whether a masted midpoint node gives better stability than pushing power on the end nodes.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Highway ISR Camera Link (2.4 GHz), Masted Mesh Relay (2.4 GHz)
- **Tags:** silvus, highway-cut, 2.4ghz, isr, nlos, mast, routing

## RF-132 - Silvus Backhaul For FPV Strike Cell

**User Prompt**

Build a Silvus backhaul for an FPV strike cell using 4200 4.9 GHz nodes between pilots, observers, and the fires coordinator. Recommend which node should anchor the mesh, how to separate mesh traffic from 915 MHz control and 5.8 GHz video, and what hop budget keeps the strike loop fast enough.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** silvus, fpv, backhaul, 4.9ghz, 915mhz, 5.8ghz, strike-cell

## RF-133 - Silvus Urban Access Node Screen

**User Prompt**

Assess a Silvus 4200 2.4 GHz mesh feeding teams moving through parking ramps, walled service roads, and rail-cut approaches from street level. Recommend where above-ground relay nodes belong, whether a ramp-edge drop node is required, and what degree of latency increase to expect once the signal path bends around concrete corners and retaining walls.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Access Ramp Relay (2.4 GHz), AN/PRC-163 Falcon IV (SRW MANET - Soldier Radio)
- **Tags:** silvus, urban, access-ramp, 2.4ghz, latency, relay, concrete

## RF-134 - Silvus 5.8 GHz With Airborne Midspan Relay

**User Prompt**

Compare a pure rooftop Silvus 4400 5.8 GHz mesh against a layout that inserts one airborne midspan relay over a dense industrial district. I need the better answer for throughput, survivability, and recovery if one rooftop gets forced offline.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Airborne Mesh Relay (5.8 GHz), Rooftop Backhaul Node (5.8 GHz)
- **Tags:** silvus, airborne-relay, 5.8ghz, industrial, throughput, survivability, recovery

## RF-135 - Silvus Mesh For Forward Surgical Team

**User Prompt**

Design a resilient Silvus 4200 4.9 GHz mesh around a forward surgical team, casualty collection points, and an evacuation lane. Recommend node placement around tents and berms, expected blind spots, and how to preserve medical traffic if one relay site has to displace suddenly.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Medical Telemetry Link (4.9 GHz), Dismounted Team Voice Link (VHF)
- **Tags:** silvus, medical, 4.9ghz, evacuation, relay, displacement, resilience

## RF-136 - Silvus Mesh Across Karst Ridges

**User Prompt**

Plan a Silvus 4200 2.4 GHz mesh over karst ridges and sinkholes carrying reconnaissance traffic and FPV cueing. Show which ridges are mandatory relay points, where sinkhole geometry creates hidden gaps, and when it is worth shifting a node to a less ideal tactical position for a cleaner RF path.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Reconnaissance Data Link (2.4 GHz), FPV Observer Feed (5.8 GHz)
- **Tags:** silvus, karst, ridges, 2.4ghz, recon, fpv, relay

## RF-137 - Silvus Convoy Escort Mesh Under Stretch

**User Prompt**

Use Silvus 4200 4.9 GHz nodes to support a stretched convoy with escort vehicles, a lead scout, and a trailing recovery truck. Recommend spacing, mobile relay roles, and what latency penalty to expect when the convoy goes from two hops to four hops through rolling ground.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Vehicle Escort Data Link (4.9 GHz), FPV Scout Relay (5.8 GHz)
- **Tags:** silvus, convoy, 4.9ghz, mobile-relay, latency, rolling-ground, escort

## RF-138 - Silvus Mesh For Coastal Battery Fire Control

**User Prompt**

Build a Silvus 4400 5.8 GHz mesh linking coastal observers, a fires cell, and a hidden battery position. Show where sea clutter and cliff shadowing complicate the path, how high each relay must sit, and whether the battery should have its own relay or stay behind a shared observation relay.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Coastal Observer Link (5.8 GHz), Fire Direction Link (5.8 GHz)
- **Tags:** silvus, coastal, fires, 5.8ghz, cliffs, sea-clutter, relay

## RF-139 - Silvus Mesh For Counterattack Reserve

**User Prompt**

Design a Silvus 4200 2.4 GHz network for a reserve force that has to stay masked behind terrain until committed. Recommend where low-signature standby relays should wait, how quickly they need to move when the reserve launches, and what route keeps the mesh from collapsing during the push forward.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Reserve Force Data Link (2.4 GHz), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** silvus, reserve, 2.4ghz, low-signature, mobility, relay, counterattack

## RF-140 - Silvus Mesh For Roofline Sniper Teams

**User Prompt**

Plan a Silvus 4200 4.9 GHz mesh for rooftop sniper-observer teams and a concealed command node in a dense city. Recommend how many rooftops need direct links versus relay-only roles, where 5.8 GHz FPV scout feeds can coexist nearby, and which node is most dangerous to lose.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), FPV Scout Feed (5.8 GHz), Rooftop Observer Link (4.9 GHz)
- **Tags:** silvus, rooftop, sniper, 4.9ghz, fpv, relay, urban

## RF-141 - MPU-5 Moving Mesh For Assault Platoons

**User Prompt**

Design a Persistent Systems Wave Relay MPU-5 2.4 GHz moving mesh for assault platoons crossing broken urban terrain. Recommend spacing, relay behavior, and when one team should pause movement briefly to stabilize the mesh for command and FPV overwatch.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Overwatch Link (5.8 GHz), AN/PRC-154 Rifleman Radio (Soldier Radio Waveform)
- **Tags:** mpu-5, wave-relay, 2.4ghz, urban, moving-mesh, fpv, assault

## RF-142 - MPU-5 4.9 GHz Border Patrol Mesh

**User Prompt**

Plan a Wave Relay MPU-5 4.9 GHz mesh for patrol bases, mobile teams, and a remote camera site across a border sector with shallow ridges and long draws. Show what terrain nodes matter most, how many hops remain practical, and where an elevated relay should sit if one patrol base goes dark.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Remote Camera Backhaul (4.9 GHz), Elevated Mesh Relay (4.9 GHz)
- **Tags:** mpu-5, border, 4.9ghz, mesh, patrol-base, hops, relay

## RF-143 - MPU-5 5.8 GHz Urban Video Backbone

**User Prompt**

Build a high-rate MPU-5 5.8 GHz urban video backbone carrying feeds from rooftop observers and FPV relay drones to a local command post. Recommend whether the network should bias for fewer hops or better concealment, and show where throughput drops hard when one roofline is masked.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Rooftop Video Feed (5.8 GHz), Airborne Relay Feed (5.8 GHz)
- **Tags:** mpu-5, 5.8ghz, urban, video, throughput, rooftop, airborne-relay

## RF-144 - MPU-5 Mesh Through Dense Forest Trails

**User Prompt**

Assess how MPU-5 2.4 GHz nodes should be placed on teams and trail intersections in dense forest. Recommend interval spacing, whether one above-canopy relay is worth adding, and how to preserve a stable path for both team telemetry and cueing from short-range FPV scouts.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Above-Canopy Relay (2.4 GHz), FPV Scout Feed (5.8 GHz)
- **Tags:** mpu-5, forest, 2.4ghz, trails, above-canopy, mesh, fpv

## RF-145 - MPU-5 Convoy Recovery Link In Hills

**User Prompt**

Plan an MPU-5 4.9 GHz convoy mesh linking lead security, main body, recovery element, and a UAV observer over hilly roads. Recommend which nodes act as mobile relays, how much convoy stretch the mesh can tolerate, and what latency or packet loss to expect through three or more hops.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), UAV Observer Link (4.9 GHz), Vehicle Escort Node (4.9 GHz)
- **Tags:** mpu-5, convoy, 4.9ghz, hills, uav, mobile-relay, latency

## RF-146 - MPU-5 Mesh For Harbor Security Teams

**User Prompt**

Build an MPU-5 5.8 GHz mesh around piers, warehouses, and patrol boats supporting harbor security. Show where cranes and container stacks shadow the network, whether a mast relay onshore or relay on a vessel is better, and how to keep emergency alerts immediate.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Patrol Boat Data Link (5.8 GHz), Shore Relay Mast (5.8 GHz)
- **Tags:** mpu-5, harbor, 5.8ghz, cranes, patrol-boat, relay, emergency

## RF-147 - MPU-5 Mesh For Trench Support Echelons

**User Prompt**

Design an MPU-5 2.4 GHz mesh for squads in support trenches, ammo runners, and casualty evacuation routes. Recommend where trench lip geometry breaks the network, where one relay should be elevated, and how to keep the mesh from pinning everything on a single exposed node.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Elevated Mesh Relay (2.4 GHz), Tactical Casualty Link (2.4 GHz)
- **Tags:** mpu-5, trench, 2.4ghz, relay, casualty, exposed-node, support

## RF-148 - MPU-5 Mesh With Airborne Observer Bridge

**User Prompt**

Use MPU-5 4.9 GHz nodes on the ground and one airborne bridge to connect teams separated by a ridge and a built-up hamlet. Recommend orbit height, expected hop reduction, and the best fallback if the airborne bridge is forced down.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Airborne Mesh Bridge (4.9 GHz), Ground Team Mesh Node (4.9 GHz)
- **Tags:** mpu-5, airborne-bridge, 4.9ghz, ridge, fallback, mesh, hamlet

## RF-149 - MPU-5 5.8 GHz For Battalion ISR Push

**User Prompt**

Plan an MPU-5 5.8 GHz battalion ISR push carrying multiple camera and sensor feeds from scouts on broken ridgelines. Recommend which nodes deserve the best antennas, where to place relay overwatch, and when hop count becomes the main throughput limiter instead of terrain.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Scout Sensor Feed (5.8 GHz), Relay Overwatch Node (5.8 GHz)
- **Tags:** mpu-5, 5.8ghz, isr, ridgeline, throughput, scouts, relay

## RF-150 - MPU-5 Mesh For Urban Reserve Street Entry

**User Prompt**

Design an MPU-5 2.4 GHz layout that supports a reserve force moving from a sheltered rear courtyard and parking ramp to street-level fighting positions. Show where to put ramp-edge nodes, whether a rooftop relay is needed immediately outside the entry point, and how to avoid a complete mesh collapse if one edge node is hit.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Access Edge Relay Node (2.4 GHz), Rooftop Relay Node (2.4 GHz)
- **Tags:** mpu-5, urban, 2.4ghz, access-edge, reserve, rooftop, node-loss

## RF-151 - MPU-5 Mesh For Drone Hunter Teams

**User Prompt**

Build an MPU-5 4.9 GHz mesh for counter-drone hunter teams, radar spotters, and intercept vehicles spread through rolling farmland. Recommend relay priorities, latency expectations, and the best way to keep the network functional if one mobile node outruns the others while chasing a track.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Counter-UAS Spotter Link (4.9 GHz), Intercept Vehicle Node (4.9 GHz)
- **Tags:** mpu-5, counter-drone, 4.9ghz, rolling-farmland, latency, mobile-node, mesh

## RF-152 - MPU-5 Coastal Raid Team Link

**User Prompt**

Plan a coastal raid support mesh with MPU-5 5.8 GHz between beach teams, bluff observers, and a command skiff. Recommend whether the skiff should act as a relay, what cliff angles will still block the network, and how to preserve video for landing updates under sea-spray and cliff shadowing.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Beach Team Video Link (5.8 GHz), Command Skiff Relay Node (5.8 GHz)
- **Tags:** mpu-5, coastal, 5.8ghz, raid, skiff, cliffs, video

## RF-153 - MPU-5 Mesh In Rubble Field

**User Prompt**

Design an MPU-5 2.4 GHz mesh for teams operating through rubble and partially collapsed blocks. Show where rubble height and broken facades create the worst NLOS effects, and recommend whether short-spacing many nodes beats fewer elevated nodes for keeping control and situational awareness alive.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Dismounted Team Node (2.4 GHz), Elevated Relay Node (2.4 GHz)
- **Tags:** mpu-5, rubble, 2.4ghz, nlos, spacing, elevated-node, urban

## RF-154 - MPU-5 Patrol Base To OP Mesh

**User Prompt**

Use MPU-5 4.9 GHz nodes to link a patrol base, two observation posts, and one mobile reaction team over broken wooded ground. Recommend which OP should host the primary relay, what alternate route exists if that OP is lost, and how much throughput remains for live camera traffic at each hop count.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Observation Post Camera Link (4.9 GHz), Reaction Team Node (4.9 GHz)
- **Tags:** mpu-5, patrol-base, op, 4.9ghz, alternate-route, throughput, wooded

## RF-155 - MPU-5 5.8 GHz Rooftop Repeater Hunt

**User Prompt**

Plan an MPU-5 5.8 GHz network where the enemy is actively hunting rooftop repeaters. Recommend how to distribute relay responsibility, when to accept an extra hop instead of using the tallest roof, and what geometry offers the best compromise between path quality and survivability.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Rooftop Relay Node (5.8 GHz), Hidden Street-Level Node (5.8 GHz)
- **Tags:** mpu-5, 5.8ghz, rooftop, survivability, relay-hunt, hops, urban

## RF-156 - Hybrid Silvus And MPU-5 Assault Stack

**User Prompt**

Design a layered assault stack using Silvus 4200 at 4.9 GHz for high-rate backhaul and MPU-5 at 2.4 GHz for close moving teams. Show where the gateway between the two meshes should sit, what traffic belongs on each layer, and how to keep FPV strike coordination low latency.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Strike Coordination Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, silvus, mpu-5, 4.9ghz, 2.4ghz, gateway, fpv

## RF-157 - Silvus To MPU-5 Gateway In Dense City

**User Prompt**

Build a city network where rooftop Silvus 4400 5.8 GHz nodes carry heavy video and street-level MPU-5 2.4 GHz nodes carry moving assault teams. Recommend the gateway node location, how many gateways are needed for resilience, and where bandwidth bottlenecks appear when both layers are active.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Rooftop Gateway Node (5.8 GHz / 2.4 GHz)
- **Tags:** hybrid, gateway, silvus, mpu-5, urban, bandwidth, resilience

## RF-158 - FPV Repeater Controlled By Mesh Backhaul

**User Prompt**

Plan an FPV repeater architecture where the airborne repeater is backhauled over Silvus 4200 2.4 GHz nodes and local teams use 915 MHz control with 5.8 GHz video. I need placement for the backhaul anchor, the repeater orbit, and the fallback if the backhaul relay gets cut.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, silvus, backhaul, airborne-relay, 2.4ghz, 915mhz, 5.8ghz

## RF-159 - MPU-5 Support To FPV Observer Belt

**User Prompt**

Use MPU-5 4.9 GHz to support an observer belt that controls several FPV scouts on 868 MHz and 1.2 GHz. Recommend which observation posts need mesh relays, where to keep the FPV controllers relative to the mesh nodes, and how to prevent one busy observer node from becoming a bottleneck.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz)
- **Tags:** mpu-5, fpv, observer-belt, 4.9ghz, 868mhz, 1.2ghz, bottleneck

## RF-160 - Silvus Backhaul For Dual Air Repeater FPV Cell

**User Prompt**

Design a dual-air-repeater FPV cell where two repeaters alternate coverage while a Silvus 4400 2.4 GHz backbone feeds the launch and command nodes. Recommend which relay should be primary at each phase, what overlap is needed for seamless handover, and how to keep the backbone from becoming the fragile center of gravity.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Airborne FPV Relay (915 MHz / 5.8 GHz), FPV Command Node Backhaul (2.4 GHz)
- **Tags:** silvus, fpv, dual-air-relay, handover, 2.4ghz, backbone, command

## RF-161 - FPV 915 MHz Control Versus 868 MHz Trade Study

**User Prompt**

Compare 915 MHz and 868 MHz control links for the same FPV mission over rolling terrain with one repeater and a 5.8 GHz video leg. Recommend which control frequency is more forgiving in this geometry, what the antenna tradeoffs are, and when the difference is operationally meaningful.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), ExpressLRS Control Link (868 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, 915mhz, 868mhz, comparison, rolling-terrain, control-link, repeater

## RF-162 - FPV 1.2 GHz Video Versus 5.8 GHz Urban Tradeoff

**User Prompt**

Assess whether 1.2 GHz or 5.8 GHz video is the better leg for FPV support in a dense urban block when control stays on 915 MHz. Show where the lower frequency materially helps, what antenna penalties it imposes, and which relay geometry gives the cleaner overall system.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Digital FPV Video Downlink (1.2 GHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, urban, 1.2ghz, 5.8ghz, tradeoff, 915mhz, relay

## RF-163 - FPV 433 MHz Long Reach Team

**User Prompt**

Plan a long-reach FPV team using 433 MHz control, 1.3 GHz video, and a high-elevation relay to support targets behind successive ridgelines. Recommend how much extra range actually survives terrain, where the relay must sit, and when the antenna and signature penalty outweigh the propagation benefit.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), High-Elevation FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, 433mhz, 1.3ghz, long-range, ridgeline, relay, signature

## RF-164 - FPV Frequency Plan For Four Simultaneous Sorties

**User Prompt**

Build a frequency and relay plan for four simultaneous FPV sorties using mixed 868 MHz and 915 MHz control links plus multiple 5.8 GHz video channels. Recommend channel blocks, physical separation, and relay placement that minimize self-interference while keeping all four aircraft usable in the same fight.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, frequency-plan, deconfliction, 868mhz, 915mhz, 5.8ghz, multi-sortie

## RF-165 - FPV Repeater On Water Tower Versus Drone Orbit

**User Prompt**

Compare placing an FPV repeater on a water tower versus using a loitering drone relay for 915 MHz control and 5.8 GHz video over suburban terrain. I need a recommendation on latency, stability, survivability, and how each option handles masked streets and backyards.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Fixed Relay Node (915 MHz / 5.8 GHz)
- **Tags:** fpv, repeater, water-tower, drone-orbit, suburban, 915mhz, 5.8ghz

## RF-166 - FPV Relay Placement Under EW Direction Finding

**User Prompt**

Design FPV relay placement in a contested EW environment where high, static emitters are likely to be direction-found. Use 868 MHz control, 2.4 GHz video, and recommend the best compromise between low-power closer relays, high-power standoff relays, and mobile airborne relays.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Contested FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, ew, direction-finding, 868mhz, 2.4ghz, low-power, relay

## RF-167 - FPV Relay For Reverse Slope Mortar Team

**User Prompt**

Plan an FPV relay supporting a reverse-slope mortar team using 915 MHz control and 5.8 GHz video. Recommend whether the relay belongs on the crest, slightly forward, or above the crest on a drone, and explain which geometry best supports both observation and team survivability.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, reverse-slope, mortar, 915mhz, 5.8ghz, airborne-relay, survivability

## RF-168 - FPV Relay For Urban Service Alley Attack

**User Prompt**

Build a relay concept for FPVs launched near service alleys, loading ramps, and walled access courts using 868 MHz control and 1.2 GHz video. Show where surface relays must sit, what parts of the route are impossible without a second relay, and whether the launch team should remain at the entry point or displace after launch.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Surface FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, urban, service-alley, 868mhz, 1.2ghz, relay, access-court

## RF-169 - FPV Repeater For Forest Firebreak Assault

**User Prompt**

Plan an FPV support package for teams moving along a forest firebreak using 915 MHz control, 5.8 GHz video, and one repeater quad. Recommend orbit line, standoff, and how to keep the relay from drifting into a geometry where the treeline suddenly blocks the return path.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, forest, firebreak, 915mhz, 5.8ghz, orbit, relay

## RF-170 - FPV Relay Net For Dam Approach

**User Prompt**

Design an FPV relay architecture for a dam approach with steep concrete, water reflection, and service roads on multiple levels. Use 915 MHz control and 5.8 GHz video, and recommend whether one elevated relay is enough or if each level needs its own relay geometry.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Multi-Level FPV Relay Nodes (915 MHz / 5.8 GHz)
- **Tags:** fpv, dam, water-reflection, multi-level, 915mhz, 5.8ghz, relay

## RF-171 - Silvus Frequency Choice For Dense Urban FPV Cell

**User Prompt**

Compare Silvus 4200 at 2.4 GHz and 4.9 GHz as the mesh layer for an urban FPV cell using 915 MHz control and 5.8 GHz video. Recommend which mesh frequency is better for rooftops and alley relays, what interference risks each brings, and how to split traffic across them if both are available.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** silvus, fpv, 2.4ghz, 4.9ghz, urban, interference, relay

## RF-172 - Wave Relay Frequency Choice For Moving Convoy Mesh

**User Prompt**

Assess MPU-5 2.4 GHz versus 4.9 GHz for a moving convoy mesh that must also support FPV scout cueing. Show which band tolerates terrain and vehicle masking better, when the higher band is worth it, and what relay spacing should change between the two.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Scout Link (5.8 GHz)
- **Tags:** mpu-5, convoy, 2.4ghz, 4.9ghz, comparison, terrain, relay-spacing

## RF-173 - Silvus And FPV Coexistence On Rooftops

**User Prompt**

Plan rooftop coexistence for Silvus 4400 5.8 GHz backhaul and 5.8 GHz FPV video links on the same block. Recommend separation, antenna orientation, time or frequency deconfliction, and whether the FPV launch team should move to a lower roof to reduce self-interference.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Analog FPV Video Downlink (5.8 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** silvus, fpv, coexistence, rooftop, 5.8ghz, interference, deconfliction

## RF-174 - MPU-5 Support To Airborne Repeater Corridor

**User Prompt**

Build an MPU-5 4.9 GHz support mesh for a corridor of airborne FPV repeaters that hands off control to teams moving through broken suburb and open fields. Recommend where the mesh anchor should be, how many relay aircraft can be supported, and where congestion becomes the limiting factor.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz), Ground Control Node (4.9 GHz)
- **Tags:** mpu-5, airborne-relay, fpv, 4.9ghz, corridor, congestion, suburban

## RF-175 - Silvus Mesh For Drone Swarm Coordination

**User Prompt**

Design a Silvus 4200 2.4 GHz mesh for a drone swarm coordination cell controlling multiple FPV and ISR aircraft. Recommend how to separate command traffic, telemetry, and video requests, where the mesh gateways belong, and what node count the team can manage before coordination traffic slows.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), FPV Coordination Link (915 MHz), ISR Drone Video Request Channel (5.8 GHz)
- **Tags:** silvus, drone-swarm, 2.4ghz, coordination, fpv, gateways, scaling

## RF-176 - Wave Relay For Distributed Launch Sites

**User Prompt**

Use MPU-5 2.4 GHz to connect three distributed FPV launch sites, two observer teams, and a fires coordinator. Recommend which launch site should host the gateway, where additional relays are mandatory, and how to preserve a command path when one launch site has to displace unexpectedly.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** mpu-5, distributed-launch, 2.4ghz, fpv, gateway, displacement, command

## RF-177 - Hybrid Mesh For Mountain Drone Corridor

**User Prompt**

Plan a mountain drone corridor using Silvus 4.9 GHz on the high ground and MPU-5 2.4 GHz in the low ground, with FPV repeaters bridging blind saddles. Show where each layer should dominate, how the gateways should be protected, and what the corridor can survive if one saddle relay is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, mountain, corridor, silvus, mpu-5, saddle-relay, fpv

## RF-178 - Silvus Mesh For Counterbattery Observer Network

**User Prompt**

Build a Silvus 4400 2.4 GHz network linking counterbattery observers, a fires cell, and FPV spotting teams across rolling broken ground. Recommend relay locations, expected throughput for target handoff products, and when the observers need their own isolated relay instead of sharing with the FPV teams.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), FPV Spotter Feed (5.8 GHz), Fire Direction Data Link (2.4 GHz)
- **Tags:** silvus, counterbattery, 2.4ghz, fires, fpv, throughput, relay-isolation

## RF-179 - MPU-5 Mesh For Transit Entrance Defense

**User Prompt**

Design an MPU-5 2.4 GHz mesh covering transit entrances, stair towers, pedestrian overpasses, and nearby rooftops during a defense of multiple urban access points. Recommend which entrances get direct mesh nodes, where rooftop relays should sit, and how to avoid all traffic funneling through one exposed roof.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Rooftop Relay Node (2.4 GHz), Entrance Defense Link (2.4 GHz)
- **Tags:** mpu-5, urban, defense, 2.4ghz, rooftop, funnel-risk, relay

## RF-180 - High Density FPV And Mesh EW Deconfliction

**User Prompt**

Build an emissions plan for an area running Silvus 4.9 GHz, MPU-5 2.4 GHz, 915 MHz FPV control, and multiple 5.8 GHz video links under enemy EW pressure. Recommend which frequencies to prioritize, what power restrictions matter most, and which relay nodes should go silent first if emissions must be cut.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** ew, deconfliction, silvus, mpu-5, fpv, emissions, priority

## RF-181 - FPV Relay Net For Open Steppe Pursuit

**User Prompt**

Design an FPV pursuit support plan over open steppe using 915 MHz control and 5.8 GHz video with one fast-moving vehicle relay and one airborne fallback relay. Recommend how far the ground relay can lead, when to switch to the airborne relay, and which terrain folds still matter in otherwise open country.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Vehicle and Airborne FPV Relays (915 MHz / 5.8 GHz)
- **Tags:** fpv, steppe, pursuit, vehicle-relay, airborne-relay, 915mhz, 5.8ghz

## RF-182 - FPV Repeater For Urban Strongpoint Isolation

**User Prompt**

Plan a repeater layout for isolating an urban strongpoint with FPVs using 868 MHz control and 2.4 GHz video. Show whether the repeater belongs above the strongpoint, on a flank roof, or behind the assault force, and what geometry gives the best control of the approach streets.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Rooftop FPV Repeater (868 MHz / 2.4 GHz)
- **Tags:** fpv, urban-strongpoint, 868mhz, 2.4ghz, rooftop, assault, streets

## RF-183 - FPV Relay Plan For Marsh And Causeway

**User Prompt**

Build an FPV relay plan for teams operating along a causeway through marshland using 915 MHz control and 5.8 GHz video. Recommend whether relays should sit on causeway towers, small boats, or airborne, and how water reflection and sparse cover affect the decision.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Causeway FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, marsh, causeway, water-reflection, 915mhz, 5.8ghz, relay

## RF-184 - FPV Link For Reverse Urban Canyon Shot

**User Prompt**

Assess an FPV geometry where the aircraft must approach a target from the reverse side of tall city blocks, forcing a bent path for both control and video. Use 915 MHz control, 5.8 GHz video, and recommend the minimum relay stack needed to keep the shot feasible without overbuilding the architecture.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Urban FPV Relay Stack (915 MHz / 5.8 GHz)
- **Tags:** fpv, urban-canyon, reverse-approach, 915mhz, 5.8ghz, relay-stack, feasibility

## RF-185 - Silvus 2.4 GHz Mesh For Rural LP-OP Belt

**User Prompt**

Design a Silvus 4200 2.4 GHz mesh for rural listening posts and observation posts spread along a hedgerow network. Recommend exactly which intersections need relay nodes, what hop count preserves usable camera traffic, and where a hidden mast is worth the signature.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), LP-OP Camera Link (2.4 GHz), Hidden Mast Relay (2.4 GHz)
- **Tags:** silvus, rural, lpop, 2.4ghz, relay, hedgerow, camera

## RF-186 - Silvus 4.9 GHz Mesh For Breach Support Robots

**User Prompt**

Use Silvus 4200 4.9 GHz nodes to support breach robots, engineer teams, and a covered command point in broken industrial terrain. Show where line-of-sight and throughput matter most, where to put the robot relay, and which node should be hardened as the primary gateway.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Breach Robot Data Link (4.9 GHz), Command Gateway Node (4.9 GHz)
- **Tags:** silvus, breach-robot, 4.9ghz, industrial, gateway, throughput, engineers

## RF-187 - Silvus 5.8 GHz Mesh For Port Crane Overwatch

**User Prompt**

Plan a 5.8 GHz Silvus 4400 network using crane tops and warehouse roofs for overwatch and security video. Recommend which crane nodes are actually worth using, where the network is too fragile to trust, and how to reroute if one crane becomes unavailable.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Overwatch Video Link (5.8 GHz), Warehouse Backhaul Node (5.8 GHz)
- **Tags:** silvus, port, cranes, 5.8ghz, video, reroute, overwatch

## RF-188 - MPU-5 2.4 GHz Mesh For Company Attack Through Orchard Walls

**User Prompt**

Design an MPU-5 2.4 GHz mesh for squads moving through orchard walls and irrigation ditches with one commander node, one relay team, and several FPV scouts overhead. Show where wall geometry forces relay shifts, and whether the relay team should remain central or move with the lead element.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), ExpressLRS Control Link (915 MHz), FPV Scout Feed (5.8 GHz)
- **Tags:** mpu-5, orchard, 2.4ghz, relay-team, fpv, wall-geometry, company

## RF-189 - MPU-5 4.9 GHz Mesh For Mountain Gun Line

**User Prompt**

Build an MPU-5 4.9 GHz network for a mountain gun line, observers, and a TAC node displaced along narrow shelf roads. Recommend relay saddles, likely blind arcs, and what alternate route keeps fire missions moving if one shelf-road node is cut off.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Observer Data Link (4.9 GHz), TAC Relay Node (4.9 GHz)
- **Tags:** mpu-5, mountain, 4.9ghz, gun-line, shelf-road, relay, fires

## RF-190 - MPU-5 5.8 GHz Mesh For UAV Landing Zone Security

**User Prompt**

Plan a 5.8 GHz MPU-5 mesh around a UAV landing zone with perimeter teams, recovery crew, and nearby rooftops. Recommend where the high-rate nodes should sit, how to keep the landing zone picture live, and what to do when the nearest roof becomes unavailable or too exposed.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), UAV Recovery Video Link (5.8 GHz), Rooftop Relay Node (5.8 GHz)
- **Tags:** mpu-5, 5.8ghz, uav, landing-zone, rooftop, exposure, security

## RF-191 - FPV Strike Cell With Silvus 4.9 GHz And MPU-5 2.4 GHz

**User Prompt**

Design a strike cell that uses Silvus 4.9 GHz for fixed backhaul, MPU-5 2.4 GHz for moving teams, 915 MHz for FPV control, and 5.8 GHz for video. Recommend the exact gateway hierarchy, relay placement, and traffic discipline that keep strike approval and aircraft control from stepping on each other.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** hybrid, strike-cell, silvus, mpu-5, fpv, 4.9ghz, 2.4ghz

## RF-192 - Dual Mesh For Urban Drone Ambush Teams

**User Prompt**

Build a dual-mesh architecture for urban drone ambush teams using Silvus 5.8 GHz on rooftops and MPU-5 2.4 GHz in the streets. Recommend where the gateways belong, which layer should absorb most video, and how to continue the mission if one rooftop cluster is jammed or lost.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Control and Video Links (915 MHz / 5.8 GHz)
- **Tags:** hybrid, urban, drone-ambush, silvus, mpu-5, rooftop, jamming

## RF-193 - FPV Repeater And Mesh For Counterattack Reserve

**User Prompt**

Plan a reserve counterattack package where concealed teams stay on an MPU-5 mesh until committed, then receive FPV repeater support and Silvus backhaul once they push forward. Show how the network should transition from hidden standby to mobile assault without a dead period.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, reserve, counterattack, mpu-5, silvus, fpv, transition

## RF-194 - Multi-Ridge Mesh And FPV Corridor

**User Prompt**

Design a corridor over three ridges using Silvus 4.9 GHz for the high ground, MPU-5 2.4 GHz for the valley floor, and FPV repeaters over the dead saddles. Recommend node ownership on each ridge, where gateways must exist, and which ridge loss hurts the architecture most.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** corridor, ridgeline, hybrid, silvus, mpu-5, fpv, gateways

## RF-195 - FPV Relay With Wave Relay Observer Grid

**User Prompt**

Use an MPU-5 4.9 GHz observer grid to support multiple FPV relay aircraft and launch teams spread across a rural battle area. Recommend observer node placement, which launch teams can share one relay, and when the observer grid itself becomes the limiting factor.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** mpu-5, observer-grid, fpv, 4.9ghz, rural, relay-sharing, scaling

## RF-196 - Silvus Backhaul For Counter-Drone Sensor Shooter Chain

**User Prompt**

Build a sensor-to-shooter chain using Silvus 4400 2.4 GHz for backhaul, MPU-5 4.9 GHz for edge teams, and FPV interceptors on 915 MHz and 5.8 GHz. Recommend where each layer hands off traffic, and what failure behavior still preserves immediate engagement authority.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** counter-drone, hybrid, silvus, mpu-5, fpv, backhaul, shooter-chain

## RF-197 - Hybrid Mesh Around Damaged Airfield

**User Prompt**

Design a hybrid Silvus and MPU-5 network around a damaged airfield with hangars, berms, and distant runway ends, while supporting FPV scouts and recovery vehicles. Show where the runways need their own relays, which layer belongs on vehicles, and how to route around hangar shadowing.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Scout Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, airfield, silvus, mpu-5, fpv, hangar-shadow, runway

## RF-198 - FPV Repeater Coverage For Quarry Assault With Mesh Feed

**User Prompt**

Plan a quarry assault where Silvus 2.4 GHz backhaul feeds an FPV relay over the pit while MPU-5 nodes cover the rim teams. Recommend the exact handoff points, how to isolate heavy video from command traffic, and what happens if the pit relay has to be repositioned mid-fight.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** quarry, hybrid, fpv, silvus, mpu-5, handoff, video-isolation

## RF-199 - Mesh And FPV For Deep Urban Pursuit

**User Prompt**

Build a deep urban pursuit architecture using rooftop Silvus 5.8 GHz nodes, street-level MPU-5 2.4 GHz nodes, and FPV repeaters for alley penetration. Recommend how far the pursuit can stretch, where to drop temporary relays, and which layer should be protected above all others.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, urban-pursuit, silvus, mpu-5, fpv, alley, temporary-relay

## RF-200 - FPV And Mesh PACE For Battalion Drone Company

**User Prompt**

Design a battalion drone-company PACE architecture using Silvus 4.9 GHz as primary backhaul, MPU-5 2.4 GHz as alternate moving mesh, FPV repeaters for dead ground, and VHF voice for emergency control. Show recommended node placement and exactly when each layer takes over.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), AN/PRC-163 Falcon IV (VHF LOS - SINCGARS)
- **Tags:** pace, battalion, drone-company, silvus, mpu-5, fpv, emergency

## RF-201 - FPV Launch Cell On Reverse Slope With Silvus Feed

**User Prompt**

Plan a reverse-slope FPV launch cell using Silvus 4200 4.9 GHz to feed targeting data to a hidden launch team controlling aircraft on 915 MHz with 5.8 GHz video. Recommend the data relay location, the best crest crossing point for the aircraft, and how to keep the launch cell from exposing itself during repeated sorties.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, reverse-slope, silvus, 4.9ghz, 915mhz, 5.8ghz, sortie

## RF-202 - Silvus 2.4 GHz For Drone Repair And Recovery Hub

**User Prompt**

Design a Silvus 2.4 GHz mesh around a drone repair and recovery hub with launch pads, battery tents, and a command trailer. Show which nodes need the highest capacity, how to keep internal traffic from flooding the launch-control path, and where an FPV relay staging node belongs.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Drone Recovery Hub Data Link (2.4 GHz), FPV Relay Staging Node (915 MHz / 5.8 GHz)
- **Tags:** silvus, drone-hub, 2.4ghz, recovery, launch-control, staging, fpv

## RF-203 - MPU-5 Patrol Mesh Feeding FPV Ambush Teams

**User Prompt**

Plan an MPU-5 4.9 GHz patrol mesh that feeds two hidden FPV ambush teams in broken scrub terrain. Recommend where the patrol mesh should stop and the dedicated FPV architecture should begin, and what terrain nodes are critical to keep both the patrol picture and strike option alive.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** mpu-5, patrol, fpv, ambush, 4.9ghz, scrub, critical-nodes

## RF-204 - FPV Repeater Net For Harbor Breakwater Fight

**User Prompt**

Build an FPV repeater net along a harbor breakwater using 868 MHz control and 1.2 GHz video. Compare fixed relay masts on the breakwater against short loiter relays over the water, and recommend which option better survives wave spray, sparse cover, and shifting line of sight.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Breakwater FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, harbor, breakwater, 868mhz, 1.2ghz, relay, littoral

## RF-205 - Multi-Band FPV Control And Video Redundancy

**User Prompt**

Design a redundant FPV architecture using primary 915 MHz control and 5.8 GHz video with an alternate 433 MHz control and 1.3 GHz video pair. Recommend how to choose the switchover criteria, when the alternate path is actually worth carrying, and which repeater geometry serves both plans best.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (5.8 GHz), Analog FPV Video Downlink (1.3 GHz)
- **Tags:** fpv, redundancy, 915mhz, 433mhz, 5.8ghz, 1.3ghz, switchover

## RF-206 - Silvus 4.9 GHz Relay Lattice For City Blocks

**User Prompt**

Build a relay lattice of Silvus 4200 4.9 GHz nodes across six city blocks to support assault teams, medics, and FPV overwatch. Recommend which blocks need direct relay occupancy, what spacing is excessive, and how the lattice should degrade gracefully if one node is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), FPV Overwatch Feed (5.8 GHz), Medical Team Data Link (4.9 GHz)
- **Tags:** silvus, relay-lattice, urban, 4.9ghz, fpv, graceful-degradation, medics

## RF-207 - MPU-5 2.4 GHz For Forest Drone Hunter Teams

**User Prompt**

Plan MPU-5 2.4 GHz coverage for forest drone-hunter teams using short-range FPV interceptors. Recommend team spacing, canopy relay options, and the best way to keep detection data, command, and interceptor launch authority on separate paths without overcomplicating the mesh.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz), Counter-UAS Detection Link (2.4 GHz)
- **Tags:** mpu-5, forest, drone-hunter, 2.4ghz, fpv, canopy, mesh

## RF-208 - Silvus 5.8 GHz For Rooftop Drone Defense Ring

**User Prompt**

Design a rooftop drone-defense ring using Silvus 4400 5.8 GHz nodes, optical observers, and FPV interceptors. Show where to position the highest-capacity nodes, how to reduce blind arcs between roofs, and what fallback exists if one tower roof is denied.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), FPV Interceptor Link (915 MHz / 5.8 GHz), Rooftop Observer Link (5.8 GHz)
- **Tags:** silvus, rooftop, drone-defense, 5.8ghz, interceptors, blind-arcs, fallback

## RF-209 - Hybrid Mesh For Canal Zone Fight

**User Prompt**

Plan a canal-zone communications architecture where Silvus 2.4 GHz bridges major structures, MPU-5 4.9 GHz carries moving teams, and FPV relays cross the water bends. Recommend node placement on both banks, gateway ownership, and what path fails first when one bridge is destroyed.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, canal, silvus, mpu-5, fpv, gateways, bridge-loss

## RF-210 - FPV Mesh For Counter-Armor Kill Boxes

**User Prompt**

Build a kill-box architecture using FPVs, Silvus 4.9 GHz backhaul, and MPU-5 2.4 GHz forward nodes in rolling anti-armor terrain. Recommend relay placement, where target handoff should occur, and which frequency layers should stay quiet until the final engagement window.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Strike Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, anti-armor, kill-box, silvus, mpu-5, fpv, engagement-window

## RF-211 - FPV Strike Support For Mountain Pass Interdiction

**User Prompt**

Design an FPV strike support network for mountain pass interdiction using 433 MHz control, 1.3 GHz video, and one airborne relay tied into a Silvus 4.9 GHz observer mesh. Recommend where the observer mesh anchor should sit, what relay orbit best sees both approach roads, and how to avoid overexposing the high ground nodes.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz)
- **Tags:** fpv, mountain-pass, 433mhz, 1.3ghz, silvus, observer-mesh, interdiction

## RF-212 - Wave Relay And FPV For Border Fence Gaps

**User Prompt**

Use MPU-5 4.9 GHz to cover border-fence gaps, sensor towers, and fast reaction teams while supporting occasional FPV reconnaissance. Recommend relay tower priorities, how to keep the reaction teams mobile without losing the mesh, and where the FPV launch point should sit to avoid overloading the sensor backbone.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Sensor Tower Link (4.9 GHz), FPV Recon Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, border, sensor-tower, 4.9ghz, fpv, mobility, backbone

## RF-213 - Silvus Mesh For Fires And FPV In Broken Hills

**User Prompt**

Build a Silvus 2.4 GHz mesh linking fires observers, an FPV strike cell, and a battalion TAC in broken hills. Recommend which hilltops should host relays, how to split video from call-for-fire traffic, and when one extra relay is worth more than higher power.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), FPV Strike Link (915 MHz / 5.8 GHz), Fire Direction Data Link (2.4 GHz)
- **Tags:** silvus, fires, fpv, broken-hills, 2.4ghz, hilltop, relay

## RF-214 - MPU-5 And FPV For Urban Chase Teams

**User Prompt**

Plan an MPU-5 2.4 GHz mesh for urban chase teams supported by short-range FPVs and one relay drone. Recommend where the relay drone should orbit relative to moving teams, how many blocks the teams can outrun the mesh, and what node should never be allowed to lag.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Chase Link (915 MHz / 5.8 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, urban-chase, 2.4ghz, fpv, moving-teams, relay-drone, lag

## RF-215 - Silvus High Rate Video For FPV Battle Damage Assessment

**User Prompt**

Design a Silvus 5.8 GHz network optimized for rapid battle damage assessment from FPV and rooftop cameras after strikes in an urban district. Recommend the best relay roofs, throughput expectations, and what should be dropped first if the network must trade video quality for responsiveness.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), FPV BDA Feed (5.8 GHz), Rooftop Camera Feed (5.8 GHz)
- **Tags:** silvus, 5.8ghz, bda, fpv, rooftop, throughput, responsiveness

## RF-216 - FPV And Mesh For Rear Logistics Under Drone Threat

**User Prompt**

Build a rear logistics protection architecture using Silvus 4.9 GHz for fixed nodes, MPU-5 2.4 GHz for patrols, and FPV interceptors on 915 MHz and 5.8 GHz. Recommend where the intercept teams should sit, how the meshes should interconnect, and what path survives if one logistics-yard relay goes down.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, logistics, drone-threat, silvus, mpu-5, interceptors, yard-relay

## RF-217 - FPV Relay For Reverse Slope Urban Mortar OP

**User Prompt**

Plan an FPV relay arrangement supporting an urban mortar observation point hidden behind a reverse-slope block. Use 868 MHz control, 2.4 GHz video, and recommend whether the relay belongs on the near roof, a side street mast, or a small loiter drone above the block edge.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Urban FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, urban, reverse-slope, mortar-op, 868mhz, 2.4ghz, relay

## RF-218 - Multi-Hop Silvus For Drone Team Schoolhouse

**User Prompt**

Design a training-schoolhouse style range network using Silvus 4200 2.4 GHz between launch pads, observers, and after-action review stations, while supporting multiple FPV practice lanes. Recommend node spacing, channel use, and how to keep one busy lane from degrading the whole event.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), FPV Practice Link (915 MHz / 5.8 GHz), AAR Backhaul Node (2.4 GHz)
- **Tags:** silvus, training, 2.4ghz, fpv, spacing, channel-use, aar

## RF-219 - Wave Relay For Marsh Drone Recovery Teams

**User Prompt**

Use MPU-5 4.9 GHz nodes to support drone recovery teams in marsh terrain with narrow raised trails and shallow water obstacles. Recommend relay placement, likely blind spots, and how to keep both recovery coordination and short-range FPV scouting functional without excessive node count.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Recovery Team Coordination Link (4.9 GHz), FPV Scout Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, marsh, recovery, 4.9ghz, blind-spots, fpv, node-count

## RF-220 - Hybrid Mesh For Airfield Drone Security Ring

**User Prompt**

Plan a hybrid airfield drone-security ring using rooftop Silvus 5.8 GHz, vehicle MPU-5 2.4 GHz, and FPV interceptor teams. Recommend where the gateways belong, how to cover the runway ends, and what failure sequence still leaves the security ring intact after one relay loss.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, airfield, silvus, mpu-5, fpv, runway, relay-loss

## RF-221 - FPV 915 MHz Control Plan For Three Valleys

**User Prompt**

Design a 915 MHz control architecture for FPV teams operating across three adjacent valleys with one 5.8 GHz video relay net. Recommend which valley shoulders need control relays, where the video relays should diverge from the control geometry, and what backup exists if one shoulder relay is lost.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Valley Shoulder FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, valleys, 915mhz, 5.8ghz, control-geometry, backup, relay

## RF-222 - FPV 868 MHz Control Plan For Dense Woodland

**User Prompt**

Plan a dense woodland FPV architecture using 868 MHz control, 1.2 GHz video, and a mix of mast and airborne relays. Show where mast relays stop being useful under canopy and which aircraft orbit gives the best compromise between concealment and stable geometry.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Mast and Airborne FPV Relays (868 MHz / 1.2 GHz)
- **Tags:** fpv, woodland, 868mhz, 1.2ghz, canopy, mast, airborne-relay

## RF-223 - Silvus 2.4 GHz Mesh For Deep Defensive Belt

**User Prompt**

Build a Silvus 2.4 GHz mesh for a deep defensive belt with observation posts, reserve platoons, and FPV launch hides. Recommend relay depth, which hides should stay off the mesh until activated, and how to preserve the network when the forward belt starts collapsing.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), FPV Launch Hide Link (915 MHz / 5.8 GHz), Defensive Belt Data Link (2.4 GHz)
- **Tags:** silvus, defense, 2.4ghz, depth, fpv, reserve, collapse

## RF-224 - Silvus 4.9 GHz For Assault Boats And Shore Teams

**User Prompt**

Design a 4.9 GHz Silvus mesh between assault boats, shoreline teams, and a hidden shore command node. Recommend relay placement along the shoreline, whether a boat should serve as a mesh leader, and how to preserve enough capacity for live video from the lead wave.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Assault Boat Data Link (4.9 GHz), Lead Wave Video Feed (4.9 GHz)
- **Tags:** silvus, littoral, boats, 4.9ghz, video, shoreline, relay

## RF-225 - MPU-5 2.4 GHz For Village Defense In Depth

**User Prompt**

Build an MPU-5 2.4 GHz defense-in-depth mesh across a village with outer pickets, internal strongpoints, and a reserve team. Show where the reserve should connect in, which buildings need dedicated relay nodes, and what route remains if the outer picket line is cut away.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Village Relay Node (2.4 GHz), Reserve Team Node (2.4 GHz)
- **Tags:** mpu-5, village, 2.4ghz, defense-in-depth, relay, reserve, routing

## RF-226 - MPU-5 4.9 GHz For Fire Support Observers

**User Prompt**

Plan a 4.9 GHz MPU-5 network for fire support observers, an FPV spotter cell, and a hidden fire direction center. Recommend which observers need line-of-sight relays, what latency matters for adjustment of fire, and how to keep the observer mesh alive during rapid displacement.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Spotter Link (915 MHz / 5.8 GHz), Fire Direction Data Link (4.9 GHz)
- **Tags:** mpu-5, fires, 4.9ghz, fpv, latency, observer, displacement

## RF-227 - Hybrid Mesh For Desert Logistics Corridor

**User Prompt**

Design a hybrid mesh for a desert logistics corridor using fixed Silvus 4.9 GHz hubs, MPU-5 2.4 GHz mobile nodes, and occasional FPV overwatch relays. Recommend hub spacing, where mobile relays should leapfrog, and which layer should absorb traffic if one hub is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Overwatch Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, desert, logistics, silvus, mpu-5, fpv, leapfrog

## RF-228 - FPV Repeater Plan For Urban Breach Towers

**User Prompt**

Build an FPV repeater plan for assault teams working between multistory breach towers and lower support buildings using 915 MHz control and 5.8 GHz video. Recommend which towers should host relays, how to avoid tower-to-tower dead sectors, and what backup relay keeps the approach covered if the primary tower is lost.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Tower FPV Repeater (915 MHz / 5.8 GHz)
- **Tags:** fpv, urban-breach, towers, 915mhz, 5.8ghz, dead-sector, backup

## RF-229 - Silvus And FPV For Countermobility Obstacles

**User Prompt**

Plan communications around a countermobility belt using Silvus 2.4 GHz between engineer elements and command while FPVs cover obstacle lanes. Recommend which obstacle sites need direct backhaul, where FPV relays should sit, and how to keep lane-status reporting timely when one relay shifts.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), FPV Obstacle Coverage Link (915 MHz / 5.8 GHz), Engineer Coordination Link (2.4 GHz)
- **Tags:** silvus, fpv, obstacles, engineers, 2.4ghz, relay, reporting

## RF-230 - Wave Relay For Ridge Shadow Casualty Route

**User Prompt**

Design an MPU-5 4.9 GHz route for casualty evacuation moving through ridge shadow while keeping medics, security, and commanders connected. Show where relay nodes must sit, what blind turns are unavoidable, and whether one airborne bridge is justified just for the evacuation window.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Casualty Route Coordination Link (4.9 GHz), Airborne Bridge (4.9 GHz)
- **Tags:** mpu-5, casualty, ridge-shadow, 4.9ghz, airborne-bridge, medics, route

## RF-231 - FPV Relay And Mesh For Port Interdiction

**User Prompt**

Build a port interdiction network using 915 MHz FPV control, 5.8 GHz video, Silvus 5.8 GHz rooftop backhaul, and MPU-5 2.4 GHz dockside teams. Recommend which cranes or roofs are worth using, where the gateways belong, and how to keep the dockside teams from becoming disconnected by container movement.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz)
- **Tags:** port, hybrid, fpv, silvus, mpu-5, cranes, dockside

## RF-232 - FPV Repeater Posture For Snow Ridge Observation

**User Prompt**

Assess the best repeater posture for FPV observation from snow ridges into a valley using 868 MHz control and 1.2 GHz video. Recommend whether the relay should hover over the ridge, sit on a ski mast, or move along the ridgeline, and show which option best balances signature and continuity.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Snow Ridge FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, snow, ridge, 868mhz, 1.2ghz, relay-posture, signature

## RF-233 - Silvus Mesh For Urban FPV Recovery Corridor

**User Prompt**

Design a Silvus 4.9 GHz mesh to support FPV recovery corridors across a dense city after strikes. Recommend where recovery teams should route, which blocks need relay coverage, and how to keep recovery traffic from interfering with ongoing launch-control traffic.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), FPV Recovery Link (4.9 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** silvus, urban, fpv, recovery, 4.9ghz, relay-coverage, deconfliction

## RF-234 - MPU-5 Mesh For Woodland LZ Security

**User Prompt**

Plan an MPU-5 2.4 GHz mesh for landing zone security teams in woodland broken by small clearings and ridges. Recommend spacing, relay placement, and how to support short FPV patrol flights without destabilizing the landing-zone mesh.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Landing Zone Security Link (2.4 GHz), FPV Patrol Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, woodland, lz-security, 2.4ghz, fpv, spacing, relay

## RF-235 - Hybrid Mesh For River Crossing Fires And Drones

**User Prompt**

Build a river crossing architecture using Silvus 4.9 GHz for the fixed crossing-control backbone, MPU-5 2.4 GHz for moving teams, and FPV repeaters for low-ground observation. Recommend gateway placement, bank-to-bank relays, and what path survives if one crossing-control node is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, river-crossing, fires, drones, silvus, mpu-5, relay

## RF-236 - FPV Control Reliability Under Mixed Jamming

**User Prompt**

Assess how to preserve FPV control when 915 MHz is intermittently jammed but 868 MHz is cleaner, while video on 5.8 GHz is heavily contested. Recommend a frequency plan, relay posture, and decision thresholds for switching to lower-rate but more survivable paths.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), ExpressLRS Control Link (868 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, jamming, 915mhz, 868mhz, 5.8ghz, switching, survivability

## RF-237 - Silvus 2.4 GHz For Deep Rural Observation Web

**User Prompt**

Design a deep rural observation web with Silvus 2.4 GHz nodes across grain silos, treelines, and isolated farm compounds. Recommend the must-have elevated nodes, what hop count remains usable, and where FPV observer feeds should enter or leave the network.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Observation Web Link (2.4 GHz), FPV Observer Feed (5.8 GHz)
- **Tags:** silvus, rural, 2.4ghz, observation-web, hops, fpv, elevated-node

## RF-238 - Wave Relay 4.9 GHz For Factory Complex Search

**User Prompt**

Build an MPU-5 4.9 GHz mesh for teams searching a factory complex with multiple courtyards and conveyor structures. Show where courtyards require dedicated relays, whether roofline support is mandatory, and how to keep command traffic alive if one courtyard node is cut off.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Factory Search Link (4.9 GHz), Rooftop Support Node (4.9 GHz)
- **Tags:** mpu-5, factory, 4.9ghz, courtyards, rooftop, relay, search

## RF-239 - Silvus And FPV For Counter-Reconnaissance Screen

**User Prompt**

Plan a counter-reconnaissance screen using Silvus 4.9 GHz between pickets and a command post while FPV teams fly short intercept and spotting missions on 915 MHz and 5.8 GHz. Recommend the relay nodes that matter most and how to limit emissions while still reacting quickly.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** silvus, counter-recon, fpv, 4.9ghz, 915mhz, 5.8ghz, emissions

## RF-240 - Mesh Support For Distributed FPV Launch Hides

**User Prompt**

Design a network for distributed FPV launch hides using MPU-5 2.4 GHz between hides and Silvus 4.9 GHz back to command. Recommend hide spacing, gateway placement, and which hides can stay radio silent until activated without breaking the overall architecture.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz)
- **Tags:** hybrid, launch-hides, fpv, mpu-5, silvus, radio-silent, gateways

## RF-241 - FPV Relay For Railway Overpass Ambush

**User Prompt**

Build an FPV relay concept for a railway overpass ambush using 915 MHz control and 5.8 GHz video. Recommend whether the relay should sit on the overpass, on a nearby building, or airborne offset from the span, and show which geometry is least brittle if the fight shifts under the overpass.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Overpass FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, railway, overpass, ambush, 915mhz, 5.8ghz, relay

## RF-242 - Hybrid Mesh For Cliffside Littoral Patrol

**User Prompt**

Design a cliffside littoral patrol architecture using Silvus 5.8 GHz on the heights, MPU-5 4.9 GHz on the patrols, and FPV relays over blind inlets. Recommend exact relay placement and which layer should carry routine reporting versus urgent warnings.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** hybrid, littoral, cliffs, patrol, silvus, mpu-5, fpv

## RF-243 - Silvus Mesh For Urban Medical Drone Routing

**User Prompt**

Plan a Silvus 2.4 GHz network to route medical drone tasking and landing coordination across a dense city. Recommend node placement, where 5.8 GHz medical drone video can be absorbed, and how to keep emergency routing responsive when routine feeds surge.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Medical Drone Video Feed (5.8 GHz), Urban Tasking Link (2.4 GHz)
- **Tags:** silvus, medical-drone, urban, 2.4ghz, 5.8ghz, routing, emergency

## RF-244 - Wave Relay For Mobile Drone Recovery Teams In Desert

**User Prompt**

Use MPU-5 4.9 GHz for mobile drone recovery teams spread across a desert impact area with scattered berms and gullies. Recommend where relay vehicles should sit, how much terrain masking still matters, and when an airborne relay over the impact zone is worth committing.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Drone Recovery Team Link (4.9 GHz), Airborne Mesh Bridge (4.9 GHz)
- **Tags:** mpu-5, desert, recovery, 4.9ghz, relay-vehicle, airborne-bridge, terrain

## RF-245 - FPV Repeater For Hilltop OP To Valley Target Area

**User Prompt**

Design an FPV relay from a hilltop OP into a valley target area using 868 MHz control and 1.2 GHz video. Recommend whether the relay should remain tied to the OP hill or move lower toward the valley mouth, and how much margin to keep before attempting deeper penetration.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Hilltop FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, hilltop, valley, 868mhz, 1.2ghz, op, relay

## RF-246 - Silvus 4.9 GHz And FPV For Bridgehead Control

**User Prompt**

Build a bridgehead control architecture using Silvus 4.9 GHz between near bank, far bank, and command, while FPVs provide overwatch on 915 MHz and 5.8 GHz. Recommend where the main relay should sit, how to avoid overloading the far-bank node, and what alternate exists if the bridge itself becomes unusable.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** bridgehead, silvus, fpv, 4.9ghz, 915mhz, 5.8ghz, far-bank

## RF-247 - MPU-5 Mesh For Deep Woodland Security Ring

**User Prompt**

Plan a deep woodland security ring using MPU-5 2.4 GHz on patrol teams, static sentry nodes, and one elevated relay overlooking the camp. Recommend team spacing, likely blind spots under canopy, and what path survives if the elevated relay is lost.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Sentry Node Link (2.4 GHz), Elevated Camp Relay (2.4 GHz)
- **Tags:** mpu-5, woodland, 2.4ghz, security-ring, canopy, blind-spots, relay-loss

## RF-248 - Hybrid Mesh And FPV For Port Crane Inspection Under Threat

**User Prompt**

Design a network for port crane inspection and defense using Silvus 5.8 GHz on fixed roofs, MPU-5 4.9 GHz on mobile teams, and FPVs for close inspection. Recommend relay placement, coexistence plan, and which links must remain up if enemy drone pressure rises during the inspection cycle.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Inspection Link (915 MHz / 5.8 GHz)
- **Tags:** port, hybrid, silvus, mpu-5, fpv, crane-inspection, drone-pressure

## RF-249 - FPV Relay Doctrine For Airburst Threat Environment

**User Prompt**

Plan FPV repeater doctrine in an airburst threat environment where static relays are dangerous and hover relays are vulnerable. Use 915 MHz control and 5.8 GHz video, and recommend when to use brief pop-up relays, displaced relays, or no relay at all.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Pop-Up FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, airburst-threat, 915mhz, 5.8ghz, pop-up-relay, doctrine, survivability

## RF-250 - Mesh And FPV For Large Urban Search Operation

**User Prompt**

Build a citywide search architecture using Silvus 4.9 GHz for major buildings, MPU-5 2.4 GHz for moving search teams, and FPV relays to inspect dead-space courtyards and rooftops. Recommend gateway distribution, search-sector boundaries, and how to keep the system scalable over a multi-day operation.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** urban-search, hybrid, silvus, mpu-5, fpv, scalability, gateways

## RF-251 - FPV Relay For Mountain Roadblock With Switchback Shadows

**User Prompt**

Design an FPV relay package for a mountain roadblock covering several switchbacks using 433 MHz control and 1.3 GHz video. Recommend which shoulder or saddle should host the relay, and explain how far down the road the aircraft can work before the road geometry overwhelms the link.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Mountain FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, mountain-roadblock, 433mhz, 1.3ghz, switchbacks, relay, geometry

## RF-252 - Silvus High Bandwidth Mesh For Countermobility Camera Belt

**User Prompt**

Plan a Silvus 5.8 GHz camera belt watching obstacle lanes and breach points with several fixed cameras and FPV confirmation flights. Recommend throughput budgeting, relay placement, and what to degrade first if too many video feeds compete at once.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Obstacle Camera Feed (5.8 GHz), FPV Confirmation Link (915 MHz / 5.8 GHz)
- **Tags:** silvus, high-bandwidth, 5.8ghz, obstacle-belt, fpv, throughput, cameras

## RF-253 - MPU-5 For Mobile Security Around Fuel Farms

**User Prompt**

Build an MPU-5 4.9 GHz network around fuel farms, tanker routes, and security patrols with support from short-range FPV scouts. Recommend where the relay vehicles should anchor, what shadow zones the tanks create, and how to preserve immediate alerting if one patrol leaves coverage.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Scout Link (915 MHz / 5.8 GHz), Security Alert Link (4.9 GHz)
- **Tags:** mpu-5, fuel-farm, 4.9ghz, patrols, fpv, shadow-zones, alerting

## RF-254 - Hybrid Mesh For River Port Strike Defense

**User Prompt**

Plan a strike-defense architecture at a river port using Silvus 4.9 GHz fixed backhaul, MPU-5 2.4 GHz mobile teams, and FPV interceptors. Recommend how to connect quay security, crane roofs, and river patrol boats, and which relay loss hurts the defense most.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, river-port, silvus, mpu-5, fpv, defense, relay-loss

## RF-255 - FPV Control Path For Cut Approach Interdiction

**User Prompt**

Design a control path for FPVs covering road cuts, underpass approaches, and retaining-wall corridors using 868 MHz control and 1.2 GHz video. Recommend where surface relays must sit, what sectors are impossible without airborne support, and how to preserve control continuity during repeated edge-of-cut attacks.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Cut Approach FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, road-cut, 868mhz, 1.2ghz, relay, airborne-support, continuity

## RF-256 - Silvus Mesh For Rooftop Drone Command Cell

**User Prompt**

Build a rooftop drone command cell using Silvus 5.8 GHz between buildings and separate 915 MHz / 5.8 GHz FPV links for aircraft. Recommend the best rooftop hierarchy, how to handle one roof becoming unavailable, and what level of redundancy is actually necessary for a short urban strike window.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** silvus, rooftop, drone-command, 5.8ghz, redundancy, fpv, urban

## RF-257 - MPU-5 Mesh For Reserve Screen In Broken Steppe

**User Prompt**

Use MPU-5 2.4 GHz to maintain a reserve screen in broken steppe terrain with a few dominant knolls and many shallow folds. Recommend which knolls must host relays, how to keep mobile teams covered, and whether FPV scouts should launch from the relay knolls or stay offset to preserve concealment.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Scout Link (915 MHz / 5.8 GHz), Knoll Relay Node (2.4 GHz)
- **Tags:** mpu-5, steppe, reserve-screen, 2.4ghz, knolls, fpv, concealment

## RF-258 - Hybrid Mesh For Dense Industrial Drone Hunt

**User Prompt**

Design a dense industrial drone-hunt architecture using Silvus 4.9 GHz across roofs, MPU-5 4.9 GHz at ground level, and FPV interceptors. Recommend how to separate the two 4.9 GHz layers physically or logically, and what relay ownership avoids confusion during rapid engagements.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, industrial, drone-hunt, 4.9ghz, silvus, mpu-5, relay-ownership

## RF-259 - FPV Relay For Wide Wadi Crossing

**User Prompt**

Plan FPV support across a wide wadi with steep banks using 915 MHz control, 5.8 GHz video, and one temporary relay mast. Recommend mast height, bank placement, and whether a bank-top mast alone is enough or if an airborne repeater is still required to support deep crossing phases.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Temporary FPV Relay Mast (915 MHz / 5.8 GHz)
- **Tags:** fpv, wadi, 915mhz, 5.8ghz, mast, airborne-repeater, crossing

## RF-260 - Silvus And MPU-5 For Night Urban Screen

**User Prompt**

Build a night urban screen using Silvus 4.9 GHz on high buildings, MPU-5 2.4 GHz with street teams, and one FPV relay drone for alley checks. Recommend where the relay drone should stay, which nodes should stay dark until contact, and how to preserve command if the tallest building is unavailable.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Airborne FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** night, urban-screen, silvus, mpu-5, fpv, 4.9ghz, 2.4ghz

## RF-261 - FPV Repeater Net For Marsh Island Raid

**User Prompt**

Design an FPV relay network for a marsh island raid using 868 MHz control and 1.2 GHz video. Recommend whether relays should sit on the approach boats, on the island edge, or hover above the channels, and how to keep the path stable as the force transitions from water to land.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (1.2 GHz), Littoral FPV Relay (868 MHz / 1.2 GHz)
- **Tags:** fpv, marsh-island, 868mhz, 1.2ghz, raid, boats, relay

## RF-262 - Silvus Mesh For Airborne Relay Control Nodes

**User Prompt**

Use Silvus 2.4 GHz to connect the teams that launch, monitor, and recover airborne FPV repeaters. Recommend which launch node should host the backbone, how to route recovery traffic separately, and where latency matters most if a relay aircraft has to be rapidly retasked.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Airborne Relay Control Link (2.4 GHz), FPV Repeater Payload Link (915 MHz / 5.8 GHz)
- **Tags:** silvus, airborne-relay, 2.4ghz, control, recovery, latency, fpv

## RF-263 - MPU-5 Mesh For Urban Search And Sniper Overwatch

**User Prompt**

Plan an MPU-5 4.9 GHz mesh for an urban search force with rooftop sniper overwatch and short-range FPV scouts. Recommend where rooftop nodes need direct mesh access, what alleys become dead space, and how to keep the search force connected when one rooftop team must displace.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Scout Link (915 MHz / 5.8 GHz), Rooftop Overwatch Node (4.9 GHz)
- **Tags:** mpu-5, urban-search, 4.9ghz, sniper-overwatch, fpv, displacement, alleys

## RF-264 - Hybrid Mesh For Highway Ambush And Break Contact

**User Prompt**

Design a hybrid network for a highway ambush and rapid break-contact using Silvus 4.9 GHz fixed support, MPU-5 2.4 GHz moving teams, and FPV relays over overpasses. Recommend relay placement for the ambush phase, then explain how the network should contract during withdrawal.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Relay Node (915 MHz / 5.8 GHz)
- **Tags:** hybrid, highway, ambush, withdrawal, silvus, mpu-5, fpv

## RF-265 - FPV Relay Tradeoff In Dense Mountain Forest

**User Prompt**

Compare 433 MHz / 1.3 GHz and 915 MHz / 5.8 GHz FPV architectures in a dense mountain forest using one airborne relay. Recommend which pairing is superior by mission type, what antenna penalties matter, and where the relay must orbit to make either option viable.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (1.3 GHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** fpv, mountain-forest, 433mhz, 915mhz, 1.3ghz, 5.8ghz, comparison

## RF-266 - Silvus 5.8 GHz For Drone Video Concentration Point

**User Prompt**

Build a drone video concentration point using Silvus 5.8 GHz for multiple concurrent FPV and ISR feeds. Recommend the relay topology, throughput budget, and which feeds should be dropped first if the concentration point is overloaded during a critical attack window.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), FPV Video Feed (5.8 GHz), ISR Video Feed (5.8 GHz)
- **Tags:** silvus, 5.8ghz, video, concentration-point, fpv, throughput, overload

## RF-267 - MPU-5 Mesh For Broken Suburb Clearance

**User Prompt**

Design an MPU-5 2.4 GHz mesh for clearing a broken suburb with detached houses, alleys, and intermittent walls while supporting FPV peeks over rooflines. Recommend relay-house selection, likely dead zones, and how to keep the mesh organized as teams cross multiple fenced lots.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Peek Link (915 MHz / 5.8 GHz), Suburb Relay Node (2.4 GHz)
- **Tags:** mpu-5, suburb, 2.4ghz, fpv, relay-house, dead-zones, clearance

## RF-268 - Hybrid Mesh For Counter-UAS Around Fuel Depot

**User Prompt**

Build a counter-UAS architecture around a fuel depot using Silvus 4.9 GHz between fixed security towers, MPU-5 2.4 GHz on patrol vehicles, and FPV interceptors. Recommend which tower acts as the main gateway, where moving relays are required, and what frequency management is needed around the depot.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, counter-uas, fuel-depot, silvus, mpu-5, fpv, gateway

## RF-269 - FPV Relay Support For Rooftop Infiltration Team

**User Prompt**

Plan FPV support for a rooftop infiltration team using 915 MHz control and 5.8 GHz video in a city where the final target roof is surrounded by taller structures. Recommend the launch roof, relay roof, and whether a brief airborne pop-up relay is needed for the terminal phase.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Rooftop and Airborne FPV Relays (915 MHz / 5.8 GHz)
- **Tags:** fpv, rooftop-infiltration, 915mhz, 5.8ghz, urban, pop-up-relay, terminal-phase

## RF-270 - Silvus Mesh For Command And Drone Repair In Covered Yards

**User Prompt**

Design a Silvus 2.4 GHz mesh supporting command and drone repair sections working from covered vehicle yards and retaining-wall shelters. Recommend yard-edge relays, how far inside the covered work area the mesh remains useful, and where outside nodes should sit to keep the repair site hidden but reachable.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Yard Edge Relay Node (2.4 GHz), Drone Repair Coordination Link (2.4 GHz)
- **Tags:** silvus, covered-yard, 2.4ghz, drone-repair, edge-relay, hidden-site, mesh

## RF-271 - MPU-5 Relay Discipline For Long Urban Pursuit

**User Prompt**

Build relay discipline rules for an MPU-5 4.9 GHz mesh supporting a long urban pursuit with multiple turns, underpasses, and shifting rooftop support. Recommend which nodes are allowed to move, which should hold, and how to keep the mesh from chasing the lead team into collapse.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Rooftop Support Node (4.9 GHz), Pursuit Team Node (4.9 GHz)
- **Tags:** mpu-5, urban-pursuit, 4.9ghz, relay-discipline, underpasses, rooftop, collapse

## RF-272 - Hybrid Mesh For Mountain LZ And Casualty Lift

**User Prompt**

Plan a mountain landing-zone and casualty-lift network using Silvus 4.9 GHz for static support, MPU-5 2.4 GHz for moving teams, and FPV aircraft for route checks. Recommend saddle relays, LZ perimeter nodes, and what alternate path preserves medevac coordination if one ridge relay is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Route Check Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, mountain, lz, casualty-lift, silvus, mpu-5, fpv

## RF-273 - FPV Control And Video Plan For Dense High-Rise Cluster

**User Prompt**

Design an FPV control and video plan for a dense high-rise cluster using 868 MHz control and 2.4 GHz video. Recommend how many rooftop or airborne relays are required, which towers are RF traps rather than assets, and how to keep the operator on the safest building while still reaching the target cluster.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), High-Rise FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, high-rise, 868mhz, 2.4ghz, rooftop, airborne, urban

## RF-274 - Silvus Frequency Reuse Plan For Multi-Block Defense

**User Prompt**

Build a frequency reuse and placement plan for Silvus 2.4 GHz and 4.9 GHz nodes defending several city blocks while also hosting 915 MHz control and 5.8 GHz FPV video. Recommend reuse boundaries, relay responsibilities, and what physical separation prevents self-induced degradation.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 2.4 GHz), Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz)
- **Tags:** silvus, frequency-reuse, urban-defense, 2.4ghz, 4.9ghz, fpv, separation

## RF-275 - MPU-5 Mesh For Canal Bridge Security Patrols

**User Prompt**

Plan MPU-5 2.4 GHz patrol coverage for several canal bridges with intermittent FPV recon of each bridge approach. Recommend where permanent relays should sit, how mobile patrols should fill the gaps, and what to do when one bridge relay is disabled.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Bridge Security Link (2.4 GHz), FPV Recon Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, canal-bridges, 2.4ghz, patrols, fpv, permanent-relay, disabled-node

## RF-276 - Hybrid Mesh For Arctic Drone Patrol Grid

**User Prompt**

Build an arctic patrol grid using Silvus 4.9 GHz on static shelters, MPU-5 2.4 GHz on snow vehicles, and FPV scouts for route clearance. Recommend spacing, relay mast height over snow berms, and which layer should carry emergency traffic during whiteout conditions.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Scout Link (915 MHz / 5.8 GHz)
- **Tags:** arctic, hybrid, silvus, mpu-5, fpv, whiteout, relay-mast

## RF-277 - FPV Relay Architecture For Quarry Counterattack

**User Prompt**

Design an FPV relay architecture for a counterattack through quarry cuts using 433 MHz control and 1.3 GHz video. Recommend relay placement on pit rims and spoil piles, which approach lane has the best link geometry, and whether one moving relay is better than two static relays.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Quarry FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, quarry, counterattack, 433mhz, 1.3ghz, static-vs-moving, relay

## RF-278 - Silvus 5.8 GHz For Rapid Urban ISR Reconstitution

**User Prompt**

Plan how to rapidly reconstitute an urban ISR mesh using Silvus 5.8 GHz after one major rooftop cluster is lost. Recommend where replacement nodes should go, which video feeds are most important, and how to recover enough coverage for FPV scouting within minutes rather than hours.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), ISR Video Feed (5.8 GHz), FPV Scout Feed (5.8 GHz)
- **Tags:** silvus, 5.8ghz, urban-isr, reconstitution, rooftop-loss, fpv, recovery

## RF-279 - Wave Relay Mesh For Industrial Fire Response Under Threat

**User Prompt**

Build an MPU-5 4.9 GHz mesh for an industrial fire response force that also faces drone observation threat. Recommend mesh placement around tanks and buildings, where FPV scouts should launch for overwatch, and what path remains if one relay truck is pushed off station.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Overwatch Link (915 MHz / 5.8 GHz), Relay Truck Node (4.9 GHz)
- **Tags:** mpu-5, industrial-fire, 4.9ghz, fpv, relay-truck, overwatch, resilience

## RF-280 - Hybrid Mesh And FPV For Brigade Rear Drone Screen

**User Prompt**

Design a brigade rear drone screen using Silvus 4.9 GHz for fixed coverage, MPU-5 2.4 GHz for patrols, and FPV interceptors. Recommend relay towers, mobile node routes, and a practical priority plan for command, alerting, and interceptor control if the network is partially jammed.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** brigade-rear, hybrid, silvus, mpu-5, fpv, jamming, drone-screen

## RF-281 - FPV Relay Geometry For Damaged Apartment Blocks

**User Prompt**

Plan an FPV relay geometry for damaged apartment blocks with collapsed stairwells, exposed rooflines, and interior courtyards. Use 915 MHz control and 5.8 GHz video, and recommend where the relay should sit to support both external approaches and courtyard penetration.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Urban FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, apartment-blocks, courtyard, 915mhz, 5.8ghz, relay-geometry, urban

## RF-282 - Silvus Mesh For Port Entry Control And Drone Scouting

**User Prompt**

Build a Silvus 4.9 GHz network for port entry control, gate guards, and drone scouting over container rows. Recommend relay roofs, how to preserve gate-control latency, and what throughput remains for drone feeds once the gates surge with traffic.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Drone Scout Feed (5.8 GHz), Gate Control Link (4.9 GHz)
- **Tags:** silvus, port, 4.9ghz, drone-scouting, gate-control, throughput, relay

## RF-283 - MPU-5 Mesh For Ridge-To-Ridge Security Patrols

**User Prompt**

Design an MPU-5 2.4 GHz mesh for security patrols moving ridge to ridge over rocky spurs with intermittent FPV peeks into the valleys. Recommend which ridges need static nodes, how far patrols can separate, and when a small airborne bridge is more efficient than another patrol relay.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Peek Link (915 MHz / 5.8 GHz), Airborne Mesh Bridge (2.4 GHz)
- **Tags:** mpu-5, ridgeline, 2.4ghz, patrols, fpv, airborne-bridge, separation

## RF-284 - Hybrid Mesh For Dense Jungle Drone Corridor

**User Prompt**

Plan a jungle drone corridor using Silvus 2.4 GHz on elevated observation points, MPU-5 2.4 GHz on patrols, and 433 MHz / 1.3 GHz FPV relays above the canopy. Recommend which nodes must sit above canopy, where gateways belong, and how to preserve a corridor if one tree-top relay is lost.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz)
- **Tags:** jungle, hybrid, silvus, mpu-5, fpv, 433mhz, canopy

## RF-285 - FPV Repeater Net For Canalized Armor Kill Lane

**User Prompt**

Build an FPV repeater network for a canalized armor kill lane using 915 MHz control and 5.8 GHz video. Recommend where relays should be offset from the engagement line, which lane segments are blind without airborne support, and how to keep the launch team hidden from enemy scouts.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Airborne and Ground FPV Relays (915 MHz / 5.8 GHz)
- **Tags:** fpv, armor, kill-lane, 915mhz, 5.8ghz, hidden-launch, relay

## RF-286 - Silvus 4.9 GHz Mesh For Urban Utility Restoration Under Threat

**User Prompt**

Plan a Silvus 4.9 GHz mesh supporting urban utility-restoration teams while FPVs scout damaged power lines and intersections. Recommend relay placement, which rooftops are needed, and how to separate critical coordination traffic from the drone traffic.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Utility Coordination Link (4.9 GHz), FPV Infrastructure Scout Link (915 MHz / 5.8 GHz)
- **Tags:** silvus, urban, utility-restoration, 4.9ghz, fpv, rooftops, traffic-separation

## RF-287 - Wave Relay Mesh For Coastal Village Defense

**User Prompt**

Design an MPU-5 5.8 GHz mesh for a coastal village defense with rooftop teams, beach patrols, and one boat patrol. Recommend which rooftops are worth high-band nodes, where lower nodes should fill the gaps, and how to keep beach alerts immediate even when video use surges.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 5.8 GHz), Beach Patrol Alert Link (5.8 GHz), Boat Patrol Node (5.8 GHz)
- **Tags:** mpu-5, coastal-village, 5.8ghz, rooftop, beach-patrol, alerts, video-surge

## RF-288 - Hybrid Mesh For Rear Drone Repair Line

**User Prompt**

Build a rear drone repair-line architecture using Silvus 4.9 GHz for fixed work areas, MPU-5 2.4 GHz for movers and test flights, and FPV relays for local proving lanes. Recommend relay placement, path segregation, and how to keep repair, test, and operational traffic from colliding.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Test Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, repair-line, silvus, mpu-5, fpv, path-segregation, rear-area

## RF-289 - FPV Relay Plan For Cliff Road Convoy Interdiction

**User Prompt**

Design an FPV support plan for cliff road convoy interdiction using 433 MHz control, 1.3 GHz video, and one relay on a higher spur. Recommend where the spur relay should sit, how to preserve line of sight around the bends, and when the aircraft must hand off to a second relay to continue the attack.

- **Primary Radios:** ExpressLRS Control Link (433 MHz), Analog FPV Video Downlink (1.3 GHz), Spur FPV Relay (433 MHz / 1.3 GHz)
- **Tags:** fpv, convoy-interdiction, cliffs, 433mhz, 1.3ghz, relay, handoff

## RF-290 - Silvus Mesh For Counter-Drone Radar Chain

**User Prompt**

Plan a Silvus 2.4 GHz radar chain linking several short-range counter-drone radars, a command node, and FPV interceptor launch teams. Recommend where the highest-capacity relays belong, how to keep track data low latency, and which node becomes the real center of gravity.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 2.4 GHz (High-Cap)), Counter-Drone Radar Link (2.4 GHz), FPV Interceptor Coordination Link (915 MHz / 5.8 GHz)
- **Tags:** silvus, counter-drone, radar-chain, 2.4ghz, low-latency, fpv, cog

## RF-291 - MPU-5 4.9 GHz Mesh For Dam Security Patrol Boats

**User Prompt**

Design an MPU-5 4.9 GHz mesh connecting dam security patrol boats, shoreline towers, and an inland command post. Recommend relay tower placement, where the boats lose shore contact, and how FPV scouts should be integrated without saturating the moving network.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), Patrol Boat Node (4.9 GHz), FPV Scout Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, dam-security, boats, 4.9ghz, towers, fpv, moving-network

## RF-292 - Hybrid Mesh For Large Industrial Drone Hunt

**User Prompt**

Build a large industrial drone-hunt architecture using Silvus 5.8 GHz between fixed roofs, MPU-5 4.9 GHz for moving response teams, and FPV interceptors. Recommend the gateway layout, which fixed roofs should be avoided despite height, and how to manage mixed-band traffic in a steel-heavy environment.

- **Primary Radios:** Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, industrial, drone-hunt, silvus, mpu-5, steel, gateways

## RF-293 - FPV Relay And Mesh For Forward Refuel Site Security

**User Prompt**

Design communications for a forward refuel site using Silvus 4.9 GHz for fixed infrastructure, MPU-5 2.4 GHz for patrols, and FPV scouts for perimeter inspection. Recommend relay masts, patrol coverage, and what stays alive if one high relay is shut down for signature control.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Scout Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, refuel-site, silvus, mpu-5, fpv, signature-control, patrol

## RF-294 - FPV 868 MHz And 2.4 GHz Urban Wall Breach Support

**User Prompt**

Plan a wall-breach support package using 868 MHz control and 2.4 GHz video around thick urban perimeter walls. Recommend whether the relay should stay behind the breach force or move to an oblique roof, and explain which phase of the breach is most likely to lose either link.

- **Primary Radios:** ExpressLRS Control Link (868 MHz), Digital FPV Video Downlink (2.4 GHz), Urban FPV Relay (868 MHz / 2.4 GHz)
- **Tags:** fpv, wall-breach, urban, 868mhz, 2.4ghz, relay, breach-phase

## RF-295 - Silvus Mesh For Mountain Observation And Relay Summit

**User Prompt**

Design a summit-centered Silvus 4.9 GHz mesh supporting mountain observers, an FPV relay aircraft team, and a hidden TAC. Recommend what should live on the summit versus below it, and what alternate route exists if the summit must go silent due to enemy observation.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), FPV Relay Control Link (4.9 GHz), Hidden TAC Backhaul (4.9 GHz)
- **Tags:** silvus, mountain, summit, 4.9ghz, fpv-relay, alternate-route, tac

## RF-296 - Wave Relay For Deep Urban Service Corridor Teams

**User Prompt**

Build an MPU-5 2.4 GHz support network for teams inspecting deep service corridors, retaining-wall access roads, and above-ground entry points while FPV scouts cover nearby streets. Recommend where edge relays must sit, where rooftop relays become necessary, and how to retain a command path when one team moves into a heavily occluded concrete corridor.

- **Primary Radios:** Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Edge Relay Node (2.4 GHz), FPV Street Scout Link (915 MHz / 5.8 GHz)
- **Tags:** mpu-5, service-corridor, 2.4ghz, edge-relay, rooftop, fpv, concrete

## RF-297 - Hybrid Mesh For River Delta Drone Security

**User Prompt**

Design a river delta drone-security network using Silvus 4.9 GHz at fixed levee towers, MPU-5 2.4 GHz on patrol boats and vehicles, and FPV interceptors. Recommend tower spacing, gateway placement, and how to keep the patrol elements linked while channels and embankments break line of sight.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Interceptor Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, river-delta, silvus, mpu-5, fpv, levee-towers, patrol-boats

## RF-298 - FPV Relay Net For Ridge Village Clearance

**User Prompt**

Plan an FPV relay net for clearing a village spread across a ridgeline and two reverse slopes using 915 MHz control and 5.8 GHz video. Recommend where relays must sit to cover both sides of the ridge, and what launch position gives the best balance between survivability and reach.

- **Primary Radios:** ExpressLRS Control Link (915 MHz), Analog FPV Video Downlink (5.8 GHz), Ridge Village FPV Relay (915 MHz / 5.8 GHz)
- **Tags:** fpv, ridgeline-village, 915mhz, 5.8ghz, reverse-slope, launch-position, relay

## RF-299 - Silvus And MPU-5 For Large Urban Evacuation Corridor

**User Prompt**

Build a large urban evacuation corridor using Silvus 4.9 GHz on fixed roofs, MPU-5 2.4 GHz on escorts and medics, and FPV scouts for route checks. Recommend relay placement, gateway redundancy, and what traffic priorities preserve corridor control when the network is congested.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), FPV Route Check Link (915 MHz / 5.8 GHz)
- **Tags:** hybrid, urban-evacuation, silvus, mpu-5, fpv, congestion, priority

## RF-300 - Brigade Drone And Mesh Master Architecture

**User Prompt**

Design a brigade-level master architecture that combines Silvus 4.9 GHz and 5.8 GHz backhaul, MPU-5 2.4 GHz and 4.9 GHz edge meshes, 915 MHz and 868 MHz FPV control, and 5.8 GHz and 1.2 GHz video. Recommend which missions belong on each band, where repeaters and gateways should sit, how to preserve low latency for strike control, and what the PACE fallback looks like if one major relay cluster is lost.

- **Primary Radios:** Silvus StreamCaster 4200 (MIMO 2x2 - 4.9 GHz), Silvus StreamCaster 4400 (MIMO 4x4 - 5.8 GHz (High-Cap)), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 2.4 GHz), Persistent Systems Wave Relay MPU-5 (Wave Relay MANET - 4.9 GHz), ExpressLRS Control Link (915 MHz), ExpressLRS Control Link (868 MHz)
- **Tags:** brigade, master-architecture, silvus, mpu-5, fpv, repeaters, frequencies

