import {EventTypes, FullEvent} from "../types/gameEvent";
import {getIconUrl, getWowHeadUrl} from "../utils/render";
import {gql, useQuery} from "@apollo/client";
import {PaladinSpells} from "../spells/paladin";
import { SourceTypes } from "../types/source";
import {PriestSpells} from "../spells/priest";

const PLAYER_EVENTS = gql`
  query PlayerEvents($startTime: Float!, $endTime: Float!, $fightId: Int!, $code: String!, $playerId: Int!) {
    reportData {
      report(code: $code) {
        events(sourceID: $playerId, fightIDs: [$fightId], startTime: $startTime, endTime: $endTime, dataType: Casts, useAbilityIDs: false, useActorIDs: true, limit: 10000) {
          data,
          nextPageTimestamp
        }
      }
    }
  }
`

const SPELLS_TO_SHOW = {
  [SourceTypes.Paladin]: [PaladinSpells.AuraMastery, PaladinSpells.AshenHallow, PaladinSpells.AvengingWrath],
  [SourceTypes.Priest]: [
    PriestSpells.PowerWordShield,
    PriestSpells.PowerWordRadiance,
    PriestSpells.PowerWordSolace,
    PriestSpells.BoonOfTheAscended,
    PriestSpells.AscendedBlast,
    PriestSpells.SpiritShell,
    PriestSpells.Schism,
    PriestSpells.Penance,
  ],
} as const;

const Timeline = ({ playerId, fightId, code, startTime, endTime }: any) => {
  const { data } = useQuery(PLAYER_EVENTS, { variables: { playerId, fightId, code, startTime, endTime } });
  const fightDurationMs = endTime - startTime;
  const fightDurationS = fightDurationMs / 1000;
  const fightDurationM = `${Math.floor(fightDurationS / 60)}:${Math.floor(fightDurationS % 60)}`;

  const events: FullEvent[] = data?.reportData.report.events.data || [];

  console.log(events)
  return (
    <div>
      <span>Timeline | Duration: {fightDurationM} m | {fightDurationS} s </span>
      <div className="timeline">
        {events.map(({ ability: { abilityIcon, name, guid}, source: { type }, type: eventType }) => {
          const spellsToShow = SPELLS_TO_SHOW[type];
          console.log(SPELLS_TO_SHOW)
          // @ts-ignore
          if (eventType !== EventTypes.Cast || (spellsToShow && !spellsToShow.includes(guid))) {
            return null;
          }

          const iconUrl = getIconUrl(abilityIcon);

          return (
            <a target="_blank" rel="noreferrer" href={getWowHeadUrl(guid)}>
              <img className="ability-icon" src={iconUrl} alt={name} width={24} height={24} />
            </a>
          )
        })}
      </div>
    </div>
  )
};

export default Timeline;
