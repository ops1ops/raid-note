import {EventTypes, FullEvent} from "../types/gameEvent";
import {getIconUrl, getWowHeadUrl} from "../utils/render";
import {gql, useQuery} from "@apollo/client";
import {PaladinSpells} from "../spells/paladin";
import { SourceTypes } from "../types/source";

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

const IMPORTANT_SPELLS = {
  [SourceTypes.Paladin]: [PaladinSpells.AuraMastery, PaladinSpells.AshenHallow, PaladinSpells.AvengingWrath]
} as const;

const Timeline = ({ playerId, fightId, code, startTime, endTime }: any) => {
  const { data } = useQuery(PLAYER_EVENTS, { variables: { playerId, fightId, code, startTime, endTime } });

  const events: FullEvent[] = data?.reportData.report.events.data || [];

  console.log(events)
  return (
    <div>
      Timeline goes here:
      <div className="timeline">
        {events.map(({ ability: { abilityIcon, name, guid, type: abilityType}, source: { type }, type: eventType }) => {
          const importantSpells = IMPORTANT_SPELLS[type];

          if (eventType !== EventTypes.Cast || (importantSpells && !importantSpells.includes(guid))) {
            return null;
          }

          const iconUrl = getIconUrl(abilityIcon);

          return (
            <a target="_blank" rel="noreferrer" href={getWowHeadUrl(guid)}>
              <img src={iconUrl} alt={name} width={24} height={24} title={eventType} />
            </a>
          )
        })}
      </div>
    </div>
  )
};

export default Timeline;
