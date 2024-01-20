--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE administrator;
ALTER ROLE administrator WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:4RoX8pWfgWTB56G0VEjwXQ==$97HG6JJ6m4shfA/eT3PGg/WiG8kbxbwER3jIr62GIT4=:CYCBUuOmkV+WEjheWl/RBcxnbyXHNtIhfK2rPiIeCIc=';
CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:PdZg/WAzXQGH48S0q6+Y2A==$AY/mruU98mAC6CiPdYuQWtBZqQEdteIQdJCwGbZCNEM=:61davOUrGlKFU+6J9dIcfsy161hJJyTOqgOed1VP9i0=';
CREATE ROLE worldsuperpowers1;
ALTER ROLE worldsuperpowers1 WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:f9f94qTzt4Ru3zggZsv3BQ==$JklFFuquV7bVvpul6l3Vq6tY+mKlMVv+0B72t5fu1lw=:xsa8ODIOaYdpuNKgnhUzhGycA/D5ZuyURRPzGMZlSwo=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "worldsuperpowers" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg110+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: worldsuperpowers; Type: DATABASE; Schema: -; Owner: administrator
--

CREATE DATABASE worldsuperpowers WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'pl_PL.UTF-8';


ALTER DATABASE worldsuperpowers OWNER TO administrator;

\connect worldsuperpowers

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_default_color(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_default_color() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  alpha_value INT := 110;
  random_color INT;
BEGIN
  random_color := trunc(random() * 16777215)::integer;

  NEW.color := '#' || lpad(to_hex(random_color), 6, '0') || lpad(to_hex(alpha_value), 2, '0');
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_default_color() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.articles (
    username text NOT NULL,
    article text NOT NULL,
    nickname text NOT NULL,
    locale text NOT NULL,
    islocal boolean NOT NULL,
    title text NOT NULL,
    articleid character varying(21) NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL,
    upvotes integer DEFAULT 0 NOT NULL,
    CONSTRAINT non_negative_upvotes CHECK ((upvotes >= 0))
);


ALTER TABLE public.articles OWNER TO administrator;

--
-- Name: banned; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.banned (
    username text NOT NULL
);


ALTER TABLE public.banned OWNER TO administrator;

--
-- Name: chat_global; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.chat_global (
    username text NOT NULL,
    message text NOT NULL,
    avatar text DEFAULT 'blank.png'::text NOT NULL,
    nickname text NOT NULL,
    locale text NOT NULL,
    islocal boolean NOT NULL,
    "time" timestamp without time zone DEFAULT now() NOT NULL,
    message_id character varying(21) NOT NULL
);


ALTER TABLE public.chat_global OWNER TO administrator;

--
-- Name: gas_plants; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.gas_plants (
    mine_name text NOT NULL,
    owner_username text NOT NULL,
    max_workers integer DEFAULT 50 NOT NULL,
    profit_multiplier integer NOT NULL,
    owner_profit_share smallint DEFAULT 0 NOT NULL,
    building_id character varying(21) NOT NULL,
    province integer NOT NULL,
    current_workers integer DEFAULT 0 NOT NULL,
    CONSTRAINT current_workers CHECK ((current_workers >= 0)),
    CONSTRAINT gas_plants_check CHECK ((province >= 1)),
    CONSTRAINT gas_plants_check_max_workers CHECK ((max_workers >= current_workers)),
    CONSTRAINT max_workers CHECK ((max_workers >= 0)),
    CONSTRAINT owner_profit_share_max CHECK ((owner_profit_share <= 100)),
    CONSTRAINT owner_profit_share_min CHECK ((owner_profit_share >= 0)),
    CONSTRAINT profit_multiplier CHECK ((profit_multiplier >= 0))
);


ALTER TABLE public.gas_plants OWNER TO administrator;

--
-- Name: gold_mines; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.gold_mines (
    mine_name text NOT NULL,
    owner_username text NOT NULL,
    max_workers integer DEFAULT 50 NOT NULL,
    profit_multiplier integer NOT NULL,
    owner_profit_share smallint DEFAULT 0 NOT NULL,
    building_id character varying(21) NOT NULL,
    province integer NOT NULL,
    current_workers integer DEFAULT 0 NOT NULL,
    CONSTRAINT current_workers CHECK ((current_workers >= 0)),
    CONSTRAINT gold_mines_max_workers CHECK ((max_workers >= current_workers)),
    CONSTRAINT max_workers CHECK ((max_workers >= 0)),
    CONSTRAINT owner_profit_share_max CHECK ((owner_profit_share <= 100)),
    CONSTRAINT owner_profit_share_min CHECK ((owner_profit_share >= 0)),
    CONSTRAINT profit_multiplier CHECK ((profit_multiplier >= 0)),
    CONSTRAINT province CHECK ((province >= 1))
);


ALTER TABLE public.gold_mines OWNER TO administrator;

--
-- Name: google_login_data; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.google_login_data (
    username text NOT NULL,
    google_id text NOT NULL
);


ALTER TABLE public.google_login_data OWNER TO administrator;

--
-- Name: iron_mines; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.iron_mines (
    mine_name text NOT NULL,
    owner_username text NOT NULL,
    max_workers integer DEFAULT 50 NOT NULL,
    profit_multiplier integer NOT NULL,
    owner_profit_share smallint DEFAULT 0 NOT NULL,
    building_id character varying(21) NOT NULL,
    province integer NOT NULL,
    current_workers integer DEFAULT 0 NOT NULL,
    CONSTRAINT current_workers CHECK ((current_workers >= 0)),
    CONSTRAINT iron_mines_check_max_workers CHECK ((max_workers >= current_workers)),
    CONSTRAINT max_workers CHECK ((max_workers >= 0)),
    CONSTRAINT owner_profit_share_max CHECK ((owner_profit_share <= 100)),
    CONSTRAINT owner_profit_share_min CHECK ((owner_profit_share >= 0)),
    CONSTRAINT profit_multiplier CHECK ((profit_multiplier >= 0)),
    CONSTRAINT province CHECK ((province >= 1))
);


ALTER TABLE public.iron_mines OWNER TO administrator;

--
-- Name: login_data; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.login_data (
    username text NOT NULL,
    hashed_password text NOT NULL,
    email text NOT NULL,
    isemailverified boolean DEFAULT false NOT NULL,
    verification_code text NOT NULL
);


ALTER TABLE public.login_data OWNER TO administrator;

--
-- Name: markets; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.markets (
    asset integer NOT NULL,
    cash integer NOT NULL,
    balance integer NOT NULL,
    asset_name text NOT NULL
);


ALTER TABLE public.markets OWNER TO administrator;

--
-- Name: oil_fields; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.oil_fields (
    mine_name text NOT NULL,
    owner_username text NOT NULL,
    max_workers integer DEFAULT 50 NOT NULL,
    profit_multiplier integer NOT NULL,
    owner_profit_share smallint DEFAULT 0 NOT NULL,
    building_id character varying(21) NOT NULL,
    province integer NOT NULL,
    current_workers integer DEFAULT 0 NOT NULL,
    CONSTRAINT current_workers CHECK ((current_workers >= 0)),
    CONSTRAINT max_workers CHECK ((max_workers >= 0)),
    CONSTRAINT oil_fields_check_max_workers CHECK ((max_workers >= current_workers)),
    CONSTRAINT owner_profit_share_max CHECK ((owner_profit_share <= 100)),
    CONSTRAINT owner_profit_share_min CHECK ((owner_profit_share >= 0)),
    CONSTRAINT profit_multiplier CHECK ((profit_multiplier >= 0)),
    CONSTRAINT province CHECK ((province >= 1))
);


ALTER TABLE public.oil_fields OWNER TO administrator;

--
-- Name: parties; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.parties (
    partyid character varying(21) NOT NULL,
    party_name text NOT NULL,
    leader_username text NOT NULL,
    province integer NOT NULL,
    max_members integer NOT NULL,
    current_members integer DEFAULT 1 NOT NULL,
    invitation_only boolean DEFAULT false NOT NULL,
    logo text DEFAULT 'party.png'::text NOT NULL,
    CONSTRAINT parties_check_1 CHECK ((max_members >= current_members)),
    CONSTRAINT parties_check_2 CHECK ((current_members >= 0)),
    CONSTRAINT parties_check_3 CHECK ((max_members >= 0)),
    CONSTRAINT parties_check_province CHECK ((province >= 1))
);


ALTER TABLE public.parties OWNER TO administrator;

--
-- Name: partyinvitations; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.partyinvitations (
    partyid text NOT NULL,
    username text NOT NULL
);


ALTER TABLE public.partyinvitations OWNER TO administrator;

--
-- Name: pending_laws; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.pending_laws (
    stateid text NOT NULL,
    proposer text NOT NULL,
    law text NOT NULL,
    voting_end timestamp without time zone NOT NULL,
    voted_yes text[],
    voted_no text[],
    not_voted text[] NOT NULL,
    voted_abstain text[],
    law_id character varying(21) NOT NULL
);


ALTER TABLE public.pending_laws OWNER TO administrator;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.profiles (
    nickname text NOT NULL,
    avatar text DEFAULT 'blank.png'::text NOT NULL,
    username text NOT NULL,
    province integer DEFAULT 1 NOT NULL,
    military_education integer DEFAULT 1 NOT NULL,
    economic_education integer DEFAULT 1 NOT NULL,
    political_education integer DEFAULT 1 NOT NULL,
    partyid text DEFAULT 'non-partisan'::text NOT NULL,
    citizenship integer DEFAULT 1 NOT NULL,
    date_of_citizenship timestamp without time zone DEFAULT now() NOT NULL,
    damage_bonus_province integer,
    CONSTRAINT citizenship CHECK ((citizenship >= 1)),
    CONSTRAINT economic_education CHECK ((economic_education >= 1)),
    CONSTRAINT military_education CHECK ((military_education >= 1)),
    CONSTRAINT political_education CHECK ((political_education >= 1)),
    CONSTRAINT province CHECK ((province >= 1))
);


ALTER TABLE public.profiles OWNER TO administrator;

--
-- Name: provinces; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.provinces (
    province_name text NOT NULL,
    oil smallint NOT NULL,
    gas smallint NOT NULL,
    gold smallint NOT NULL,
    climate text NOT NULL,
    province_number integer NOT NULL,
    iron smallint NOT NULL,
    borders integer[],
    CONSTRAINT province_number CHECK ((province_number >= 1))
);


ALTER TABLE public.provinces OWNER TO administrator;

--
-- Name: states; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.states (
    state_name text DEFAULT ''::text NOT NULL,
    political_system text DEFAULT 'democracy'::text NOT NULL,
    stateid text DEFAULT gen_random_uuid() NOT NULL,
    creation_date timestamp without time zone DEFAULT now() NOT NULL,
    coat_of_arms text DEFAULT 'state.png'::text NOT NULL,
    members_of_parliament text[],
    provinces integer[] NOT NULL,
    leader text,
    color text DEFAULT '#000000'::character varying NOT NULL,
    CONSTRAINT provinces CHECK ((1 <= ALL (provinces)))
);


ALTER TABLE public.states OWNER TO administrator;

--
-- Name: study; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.study (
    username text NOT NULL,
    field_of_study text NOT NULL,
    finish_time timestamp without time zone NOT NULL
);


ALTER TABLE public.study OWNER TO administrator;

--
-- Name: upvotes; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.upvotes (
    "timestamp" timestamp without time zone DEFAULT now(),
    upvote boolean NOT NULL,
    username text NOT NULL,
    upvoteid character varying(21) NOT NULL,
    articleid character varying(21) NOT NULL
);


ALTER TABLE public.upvotes OWNER TO administrator;

--
-- Name: user_data; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.user_data (
    username text NOT NULL,
    gold integer DEFAULT 0 NOT NULL,
    oil integer DEFAULT 0 NOT NULL,
    gas integer DEFAULT 0 NOT NULL,
    interstellardobra integer DEFAULT 0 NOT NULL,
    iron integer DEFAULT 0 NOT NULL,
    riffles integer DEFAULT 0 NOT NULL,
    ammo integer DEFAULT 0 NOT NULL,
    grenades integer DEFAULT 0 NOT NULL,
    can_fight_from timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_data_check_aasault_riffles CHECK ((riffles >= 0)),
    CONSTRAINT user_data_check_ammo CHECK ((ammo >= 0)),
    CONSTRAINT user_data_check_gold CHECK ((gold >= 0)),
    CONSTRAINT user_data_check_grenades CHECK ((grenades >= 0)),
    CONSTRAINT user_data_check_interstellardobra CHECK ((interstellardobra >= 0)),
    CONSTRAINT user_data_check_iron CHECK ((iron >= 0)),
    CONSTRAINT user_data_gas_m3_check CHECK ((gas >= 0)),
    CONSTRAINT user_data_oil_barrels_check CHECK ((oil >= 0))
);


ALTER TABLE public.user_data OWNER TO administrator;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.votes (
    stateid text NOT NULL,
    voting_start timestamp without time zone NOT NULL,
    voting_end timestamp without time zone NOT NULL,
    partyid text[] NOT NULL,
    vote_count integer[],
    users_who_voted text[]
);


ALTER TABLE public.votes OWNER TO administrator;

--
-- Name: wars; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.wars (
    attackers_stateid text NOT NULL,
    score integer DEFAULT '-100000000'::integer NOT NULL,
    disputed_province integer NOT NULL,
    war_end timestamp without time zone NOT NULL,
    defenders_stateid text NOT NULL,
    war_id character varying(21) NOT NULL,
    attacking_province integer NOT NULL,
    CONSTRAINT attacking_province CHECK ((attacking_province >= 1)),
    CONSTRAINT disputed_province CHECK ((disputed_province >= 1))
);


ALTER TABLE public.wars OWNER TO administrator;

--
-- Name: working; Type: TABLE; Schema: public; Owner: administrator
--

CREATE TABLE public.working (
    username text NOT NULL,
    building_id text NOT NULL,
    start_time timestamp without time zone DEFAULT now() NOT NULL,
    building_type text NOT NULL,
    workplace_id character varying(21) NOT NULL
);


ALTER TABLE public.working OWNER TO administrator;

--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.articles (username, article, nickname, locale, islocal, title, articleid, "time", upvotes) FROM stdin;
\.


--
-- Data for Name: banned; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.banned (username) FROM stdin;
\.


--
-- Data for Name: chat_global; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.chat_global (username, message, avatar, nickname, locale, islocal, "time", message_id) FROM stdin;
\.


--
-- Data for Name: gas_plants; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.gas_plants (mine_name, owner_username, max_workers, profit_multiplier, owner_profit_share, building_id, province, current_workers) FROM stdin;
\.


--
-- Data for Name: gold_mines; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.gold_mines (mine_name, owner_username, max_workers, profit_multiplier, owner_profit_share, building_id, province, current_workers) FROM stdin;
\.


--
-- Data for Name: google_login_data; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.google_login_data (username, google_id) FROM stdin;
\.


--
-- Data for Name: iron_mines; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.iron_mines (mine_name, owner_username, max_workers, profit_multiplier, owner_profit_share, building_id, province, current_workers) FROM stdin;
\.


--
-- Data for Name: login_data; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.login_data (username, hashed_password, email, isemailverified, verification_code) FROM stdin;
test	$argon2i$v=19$m=4096,t=3,p=1$GJrAo0VeQTkdGTSt9Vy2wQ$Z8y3/Tw7wpg+/FixIHmAd4LPzIi5wLs11/oQukzMH50	test@test.com	t	Oo_eEcU3eeE02SA-jnb2z
admin	$argon2id$v=19$m=65536,t=2,p=4$c29tZXNhbHQ$PC5s46tzGdK/Tmsu8H63P7i3TKt81nYKSliH3m+pltE	admin@worldsuperpowers.cc	t	P13lwQj-LyM0ldskvFoWZ
\.


--
-- Data for Name: markets; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.markets (asset, cash, balance, asset_name) FROM stdin;
100	20000	2000000	gas
100	50000	5000000	gold
100	40000	4000000	oil
100	30000	3000000	iron
\.


--
-- Data for Name: oil_fields; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.oil_fields (mine_name, owner_username, max_workers, profit_multiplier, owner_profit_share, building_id, province, current_workers) FROM stdin;
\.


--
-- Data for Name: parties; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.parties (partyid, party_name, leader_username, province, max_members, current_members, invitation_only, logo) FROM stdin;
\.


--
-- Data for Name: partyinvitations; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.partyinvitations (partyid, username) FROM stdin;
\.


--
-- Data for Name: pending_laws; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.pending_laws (stateid, proposer, law, voting_end, voted_yes, voted_no, not_voted, voted_abstain, law_id) FROM stdin;
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.profiles (nickname, avatar, username, province, military_education, economic_education, political_education, partyid, citizenship, date_of_citizenship, damage_bonus_province) FROM stdin;
test	blank.png	test	1	1	1	1	non-partisan	1	2023-07-03 13:36:08.446144	\N
admin	gEVth_C4_e9GvU1mS_UUw.png	admin	1	1	1	1	non-partisan	2	2022-08-03 22:20:27.03236	2
\.


--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.provinces (province_name, oil, gas, gold, climate, province_number, iron, borders) FROM stdin;
Sao Tome and Principe	1	1	1	tropical	1	1	\N
Gabon	2	2	7	tropical	2	2	{43,44,3}
Equatorial Guinea	5	3	3	tropical	3	8	{43,2}
Congo	1	8	2	tropical	4	2	{39,42,44,26,31,33,36,37}
Djibouti	3	4	5	arid	5	3	{7,8,29}
Egypt	2	4	9	hot desert	6	3	{17,32}
Eritrea	8	3	2	tropical desert	7	4	{5,8,32}
Ethiopia	4	6	3	tropical/tropical desert	8	2	{5,7,14,29,31,32}
Gambia	2	6	3	tropical	9	4	{27}
Ghana	2	4	7	tropical	10	3	{41,13,34}
Guinea	4	3	2	tropical	11	3	{13,12,16,19,27,28}
Guinea-Bissau	5	4	6	tropical	12	3	{11,27}
Ivory Coast	2	3	10	tropical	13	3	{41,10,11,16,19}
Kenya	5	4	4	tropical	14	2	{8,29,31,33,36}
Lesotho	3	4	3	temperate	15	3	{30}
Liberia	8	3	3	tropical	16	3	{11,13,28}
Libya	8	3	3	arid	17	3	{45,46,6,24,32,35}
Malawi	3	4	3	tropical	18	3	{22,33,37}
Mali	4	4	4	tropical	19	3	{45,41,11,13,20,24,27}
Mauritania	2	3	2	hot desert	20	2	{45,19,27}
Morocco	3	2	3	Mediterranean	21	4	{45}
Mozambique	2	3	4	tropical	22	2	{18,30,33,37,38}
Namibia	3	4	3	mild desert	23	4	{39,47,30,37}
Niger	4	3	4	subtropical desert	24	3	{45,40,41,46,17,19,25}
Nigeria	6	3	4	tropical	25	4	{40,43,46,24}
Rwanda	4	4	4	tropical	26	3	{4,33,36}
Senegal	3	4	3	tropical	27	4	{9,11,12,19,20}
Sierra Leone	2	3	4	tropical	28	4	{11,16}
Somalia	3	2	3	tropical	29	3	{5,8,14}
South Africa	4	4	4	temperate	30	9	{47,15,22,23,38}
South Sudan	3	3	1	tropical	31	2	{42,4,8,14,32,36}
Sudan	2	2	1	tropical	32	2	{42,46,6,7,8,17,31}
Tanzania	4	4	3	tropical	33	3	{4,14,18,22,26,36,37}
Togo	4	3	4	tropical	34	3	{40,41,10}
Tunisia	2	4	3	Mediterranean	35	3	{45,17}
Uganda	2	2	3	tropical	36	3	{4,14,26,31,33}
Zambia	6	3	3	tropical	37	2	{39,47,4,18,22,23,33,38}
Zimbabwe	4	3	4	temperate	38	3	{47,22,30,37}
Angola	5	5	6	tropical	39	5	{44,4,37,23}
Benin	3	4	3	tropical	40	2	{41,24,25,34}
Burkina Faso	2	1	2	tropical	41	3	{40,13,10,19,24,34}
Central African Republic	4	3	4	tropical	42	4	{43,46,4,44,31,32}
Cameroon	3	4	3	tropical	43	3	{42,46,44,3,2,25}
Republic of the Congo	2	3	6	tropical	44	1	{39,43,42,4,2}
Algeria	8	4	3	Mediterranean	45	3	{35,17,24,20,19,21}
Chad	3	3	2	tropical	46	3	{43,42,17,24,25,32}
Botswana	3	4	4	sub-tropical	47	4	{23,30,37,38}
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.states (state_name, political_system, stateid, creation_date, coat_of_arms, members_of_parliament, provinces, leader, color) FROM stdin;
Sao Tome and Principe	democracy	97166a8a-3292-40d2-a860-474c80496dd2	2023-06-30 16:51:48.750546	state.png	\N	{1}	\N	#c334136e
Gabon	democracy	95b64f6f-d7b6-45d7-bba5-8146f1e607ae	2023-06-30 16:51:48.750546	state.png	\N	{2}	\N	#a3a1526e
Equatorial Guinea	democracy	b6e8255a-ea35-4469-bd64-4872f6fe1bbc	2023-06-30 16:51:48.750546	state.png	\N	{3}	\N	#ba1fa16e
Congo	democracy	dc925509-5be2-4d88-8707-91d94fc5bade	2023-06-30 16:51:48.750546	state.png	\N	{4}	\N	#344a026e
Djibouti	democracy	6ed54692-5da9-4ca6-bfd5-1a963fbde923	2023-06-30 16:51:48.750546	state.png	\N	{5}	\N	#21f9986e
Egypt	democracy	62a849e5-ce4c-445a-868d-d70802030840	2023-06-30 16:51:48.750546	state.png	\N	{6}	\N	#2fa8336e
Eritrea	democracy	2adbb9a5-a83d-49cb-99ca-d7fb0e57b098	2023-06-30 16:51:48.750546	state.png	\N	{7}	\N	#6c8a506e
Ethiopia	democracy	49ef9bf1-ec58-4610-8abc-b814a72403ec	2023-06-30 16:51:48.750546	state.png	\N	{8}	\N	#9864156e
Gambia	democracy	ab2c08d7-e50c-4d07-b668-3f016593f8de	2023-06-30 16:51:48.750546	state.png	\N	{9}	\N	#fc9a9b6e
Ghana	democracy	d259451a-ed1a-4c2e-a8c4-eb778059723f	2023-06-30 16:51:48.750546	state.png	\N	{10}	\N	#d64d1b6e
Guinea	democracy	dfb331e3-32ee-4427-a878-85b647ec09f6	2023-06-30 16:51:48.750546	state.png	\N	{11}	\N	#762e856e
Guinea-Bissau	democracy	f934c974-95ac-4505-881d-a09777a2e155	2023-06-30 16:51:48.750546	state.png	\N	{12}	\N	#ffb68d6e
Ivory Coast	democracy	1c112878-b8b7-4f70-88db-c3e992f89a16	2023-06-30 16:51:48.750546	state.png	\N	{13}	\N	#fc3f346e
Kenya	democracy	0f0707e6-41fe-4168-85d5-40f0f9f64f88	2023-06-30 16:51:48.750546	state.png	\N	{14}	\N	#448fe66e
Lesotho	democracy	00c18bf3-9db5-4eff-b95b-e8d6ba144be4	2023-06-30 16:51:48.750546	state.png	\N	{15}	\N	#82ab876e
Liberia	democracy	d132f7ce-bab8-464a-9f59-befba15c5abf	2023-06-30 16:51:48.750546	state.png	\N	{16}	\N	#a6d16f6e
Libya	democracy	5e73fb9b-d326-4296-8400-83549ab15ae5	2023-06-30 16:51:48.750546	state.png	\N	{17}	\N	#11c9666e
Malawi	democracy	87c72802-c29e-465f-948a-3debf36cae04	2023-06-30 16:51:48.750546	state.png	\N	{18}	\N	#e0f4566e
Mali	democracy	68d56d94-71a5-4e76-814d-bdc0ec8d6dd9	2023-06-30 16:51:48.750546	state.png	\N	{19}	\N	#a589076e
Mauritania	democracy	602bb8cf-e386-48a4-bdfa-33cd93dfba6b	2023-06-30 16:51:48.750546	state.png	\N	{20}	\N	#b45d756e
Morocco	democracy	cac82a16-e3c7-4a3b-a6c5-cd7e6b946822	2023-06-30 16:51:48.750546	state.png	\N	{21}	\N	#2955696e
Mozambique	democracy	bd5953b9-945c-4abf-a29b-1cd5c4dc8ff5	2023-06-30 16:51:48.750546	state.png	\N	{22}	\N	#67c0c16e
Namibia	democracy	5acf858b-dd39-4fc0-8aca-3e0b9f8aab6a	2023-06-30 16:51:48.750546	state.png	\N	{23}	\N	#64e5416e
Niger	democracy	97744f95-380f-4e1f-8a5f-b6090b920d21	2023-06-30 16:51:48.750546	state.png	\N	{24}	\N	#3b639f6e
Nigeria	democracy	668ff69b-a21a-4f18-b147-eeb8c8b23f8e	2023-06-30 16:51:48.750546	state.png	\N	{25}	\N	#e369c96e
Rwanda	democracy	0658d325-a454-4840-a72b-527ea1097131	2023-06-30 16:51:48.750546	state.png	\N	{26}	\N	#5396446e
Senegal	democracy	d635acc3-7ce7-4fb4-b155-89d8118f6091	2023-06-30 16:51:48.750546	state.png	\N	{27}	\N	#3a889d6e
Sierra Leone	democracy	e56ad2e0-b128-4ed2-a7cf-09133ac88868	2023-06-30 16:51:48.750546	state.png	\N	{28}	\N	#7ca2ba6e
Somalia	democracy	b730cc44-f358-4c39-bb3d-d7469d7d607f	2023-06-30 16:51:48.750546	state.png	\N	{29}	\N	#84b19b6e
South Africa	democracy	9b6c5d7c-9ffc-4a74-86bc-8c10df2cbf5e	2023-06-30 16:51:48.750546	state.png	\N	{30}	\N	#9375d66e
South Sudan	democracy	1925a69f-20e6-4ada-9140-5a3a9f2c5835	2023-06-30 16:51:48.750546	state.png	\N	{31}	\N	#7448936e
Sudan	democracy	2c91c039-66fb-4109-bf18-4aee05daf710	2023-06-30 16:51:48.750546	state.png	\N	{32}	\N	#d4bb436e
Tanzania	democracy	c8911973-7d8d-4d82-babe-4416fd752af1	2023-06-30 16:51:48.750546	state.png	\N	{33}	\N	#d99ec36e
Togo	democracy	53b2ea49-6458-4ac4-8b2e-333ef0b4a786	2023-06-30 16:51:48.750546	state.png	\N	{34}	\N	#6cac266e
Tunisia	democracy	117ffc16-9c23-4312-807d-7b25dd91124b	2023-06-30 16:51:48.750546	state.png	\N	{35}	\N	#bed2316e
Uganda	democracy	0a876f08-611d-47f7-82fa-4195e38a87ff	2023-06-30 16:51:48.750546	state.png	\N	{36}	\N	#46c56c6e
Zambia	democracy	989d300f-2b26-499e-a05a-5486b939258a	2023-06-30 16:51:48.750546	state.png	\N	{37}	\N	#a5ad616e
Zimbabwe	democracy	b8c1476f-6ee4-49e5-a968-7da843267aaf	2023-06-30 16:51:48.750546	state.png	\N	{38}	\N	#8293246e
Angola	democracy	a9482231-e6b8-4c08-b5fe-3b8d78844649	2023-06-30 16:51:48.750546	state.png	\N	{39}	\N	#0a485b6e
Benin	democracy	10d9ef8f-a195-4625-9507-1b67eb6db46b	2023-06-30 16:51:48.750546	state.png	\N	{40}	\N	#bba0526e
Burkina Faso	democracy	a599c790-1fce-412b-a018-c71d46001ef5	2023-06-30 16:51:48.750546	state.png	\N	{41}	\N	#1f10476e
Central African Republic	democracy	5f68cd48-dc84-4898-bfbf-8b75fd66e9a2	2023-06-30 16:51:48.750546	state.png	\N	{42}	\N	#b117f46e
Cameroon	democracy	b98fb522-8192-4a6f-a548-47af1f924082	2023-06-30 16:51:48.750546	state.png	\N	{43}	\N	#d1d27a6e
Republic of the Congo	democracy	5535913e-7273-48f2-a78c-1d413bad5520	2023-06-30 16:51:48.750546	state.png	\N	{44}	\N	#bfd6306e
Algeria	democracy	b91f779b-bcd5-4f5a-9035-b290ecaae03a	2023-06-30 16:51:48.750546	state.png	\N	{45}	\N	#984b466e
Chad	democracy	9d3d0068-2e0d-457d-9a73-55acaeece2e0	2023-06-30 16:51:48.750546	state.png	\N	{46}	\N	#0790086e
Botswana	democracy	373d7147-af7a-44a7-8628-1160e8cb99e2	2023-06-30 16:51:48.750546	state.png	\N	{47}	\N	#640f716e
\.


--
-- Data for Name: study; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.study (username, field_of_study, finish_time) FROM stdin;
\.


--
-- Data for Name: upvotes; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.upvotes ("timestamp", upvote, username, upvoteid, articleid) FROM stdin;
\.


--
-- Data for Name: user_data; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.user_data (username, gold, oil, gas, interstellardobra, iron, riffles, ammo, grenades, can_fight_from) FROM stdin;
admin	0	0	0	0	0	0	0	0	2022-12-24 03:10:20.39622
test	0	0	0	0	0	0	0	0	2023-07-03 13:25:05.712754
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.votes (stateid, voting_start, voting_end, partyid, vote_count, users_who_voted) FROM stdin;
97166a8a-3292-40d2-a860-474c80496dd2	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
95b64f6f-d7b6-45d7-bba5-8146f1e607ae	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
b6e8255a-ea35-4469-bd64-4872f6fe1bbc	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
dc925509-5be2-4d88-8707-91d94fc5bade	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
6ed54692-5da9-4ca6-bfd5-1a963fbde923	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
62a849e5-ce4c-445a-868d-d70802030840	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
2adbb9a5-a83d-49cb-99ca-d7fb0e57b098	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
49ef9bf1-ec58-4610-8abc-b814a72403ec	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
ab2c08d7-e50c-4d07-b668-3f016593f8de	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
d259451a-ed1a-4c2e-a8c4-eb778059723f	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
dfb331e3-32ee-4427-a878-85b647ec09f6	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
f934c974-95ac-4505-881d-a09777a2e155	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
1c112878-b8b7-4f70-88db-c3e992f89a16	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
0f0707e6-41fe-4168-85d5-40f0f9f64f88	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
00c18bf3-9db5-4eff-b95b-e8d6ba144be4	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
d132f7ce-bab8-464a-9f59-befba15c5abf	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
5e73fb9b-d326-4296-8400-83549ab15ae5	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
87c72802-c29e-465f-948a-3debf36cae04	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
68d56d94-71a5-4e76-814d-bdc0ec8d6dd9	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
602bb8cf-e386-48a4-bdfa-33cd93dfba6b	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
cac82a16-e3c7-4a3b-a6c5-cd7e6b946822	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
bd5953b9-945c-4abf-a29b-1cd5c4dc8ff5	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
5acf858b-dd39-4fc0-8aca-3e0b9f8aab6a	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
97744f95-380f-4e1f-8a5f-b6090b920d21	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
668ff69b-a21a-4f18-b147-eeb8c8b23f8e	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
0658d325-a454-4840-a72b-527ea1097131	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
d635acc3-7ce7-4fb4-b155-89d8118f6091	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
e56ad2e0-b128-4ed2-a7cf-09133ac88868	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
b730cc44-f358-4c39-bb3d-d7469d7d607f	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
9b6c5d7c-9ffc-4a74-86bc-8c10df2cbf5e	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
1925a69f-20e6-4ada-9140-5a3a9f2c5835	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
2c91c039-66fb-4109-bf18-4aee05daf710	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
c8911973-7d8d-4d82-babe-4416fd752af1	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
53b2ea49-6458-4ac4-8b2e-333ef0b4a786	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
117ffc16-9c23-4312-807d-7b25dd91124b	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
0a876f08-611d-47f7-82fa-4195e38a87ff	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
989d300f-2b26-499e-a05a-5486b939258a	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
b8c1476f-6ee4-49e5-a968-7da843267aaf	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
a9482231-e6b8-4c08-b5fe-3b8d78844649	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
10d9ef8f-a195-4625-9507-1b67eb6db46b	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
a599c790-1fce-412b-a018-c71d46001ef5	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
5f68cd48-dc84-4898-bfbf-8b75fd66e9a2	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
b98fb522-8192-4a6f-a548-47af1f924082	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
5535913e-7273-48f2-a78c-1d413bad5520	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
b91f779b-bcd5-4f5a-9035-b290ecaae03a	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
9d3d0068-2e0d-457d-9a73-55acaeece2e0	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
373d7147-af7a-44a7-8628-1160e8cb99e2	2024-01-21 05:52:25.459913	2024-01-21 17:52:25.459913	{}	\N	\N
\.


--
-- Data for Name: wars; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.wars (attackers_stateid, score, disputed_province, war_end, defenders_stateid, war_id, attacking_province) FROM stdin;
\.


--
-- Data for Name: working; Type: TABLE DATA; Schema: public; Owner: administrator
--

COPY public.working (username, building_id, start_time, building_type, workplace_id) FROM stdin;
\.


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (articleid);


--
-- Name: banned banned_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.banned
    ADD CONSTRAINT banned_pkey PRIMARY KEY (username);


--
-- Name: chat_global chat_global_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.chat_global
    ADD CONSTRAINT chat_global_pkey PRIMARY KEY (message_id);


--
-- Name: gas_plants gas_plants_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.gas_plants
    ADD CONSTRAINT gas_plants_pkey PRIMARY KEY (building_id);


--
-- Name: gold_mines gold_mines_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.gold_mines
    ADD CONSTRAINT gold_mines_pkey PRIMARY KEY (building_id);


--
-- Name: google_login_data google_login_data_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.google_login_data
    ADD CONSTRAINT google_login_data_pkey PRIMARY KEY (username);


--
-- Name: iron_mines iron_mines_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.iron_mines
    ADD CONSTRAINT iron_mines_pkey PRIMARY KEY (building_id);


--
-- Name: login_data login_data_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.login_data
    ADD CONSTRAINT login_data_pkey PRIMARY KEY (username);


--
-- Name: markets markets_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.markets
    ADD CONSTRAINT markets_pkey PRIMARY KEY (asset_name);


--
-- Name: oil_fields oil_fields_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.oil_fields
    ADD CONSTRAINT oil_fields_pkey PRIMARY KEY (building_id);


--
-- Name: parties parties_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.parties
    ADD CONSTRAINT parties_pkey PRIMARY KEY (partyid);


--
-- Name: pending_laws pending_laws_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.pending_laws
    ADD CONSTRAINT pending_laws_pkey PRIMARY KEY (law_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (username);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (province_number);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (stateid);


--
-- Name: upvotes upvotes_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.upvotes
    ADD CONSTRAINT upvotes_pkey PRIMARY KEY (upvoteid);


--
-- Name: user_data user_data_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.user_data
    ADD CONSTRAINT user_data_pkey PRIMARY KEY (username);


--
-- Name: wars wars_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.wars
    ADD CONSTRAINT wars_pkey PRIMARY KEY (war_id);


--
-- Name: working working_pkey; Type: CONSTRAINT; Schema: public; Owner: administrator
--

ALTER TABLE ONLY public.working
    ADD CONSTRAINT working_pkey PRIMARY KEY (workplace_id);


--
-- Name: states set_default_color_trigger; Type: TRIGGER; Schema: public; Owner: administrator
--

CREATE TRIGGER set_default_color_trigger BEFORE INSERT ON public.states FOR EACH ROW EXECUTE FUNCTION public.set_default_color();


--
-- Name: DATABASE worldsuperpowers; Type: ACL; Schema: -; Owner: administrator
--

REVOKE ALL ON DATABASE worldsuperpowers FROM administrator;
GRANT ALL ON DATABASE worldsuperpowers TO administrator WITH GRANT OPTION;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: TABLE articles; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.articles FROM administrator;
GRANT ALL ON TABLE public.articles TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.articles TO worldsuperpowers1;


--
-- Name: TABLE banned; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.banned FROM administrator;
GRANT ALL ON TABLE public.banned TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.banned TO worldsuperpowers1;


--
-- Name: TABLE chat_global; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.chat_global FROM administrator;
GRANT ALL ON TABLE public.chat_global TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.chat_global TO PUBLIC;
GRANT ALL ON TABLE public.chat_global TO worldsuperpowers1;


--
-- Name: TABLE gas_plants; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.gas_plants FROM administrator;
GRANT ALL ON TABLE public.gas_plants TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.gas_plants TO PUBLIC;
GRANT ALL ON TABLE public.gas_plants TO worldsuperpowers1;


--
-- Name: TABLE gold_mines; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.gold_mines FROM administrator;
GRANT ALL ON TABLE public.gold_mines TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.gold_mines TO PUBLIC;
GRANT ALL ON TABLE public.gold_mines TO worldsuperpowers1;


--
-- Name: TABLE google_login_data; Type: ACL; Schema: public; Owner: administrator
--

GRANT ALL ON TABLE public.google_login_data TO worldsuperpowers1;


--
-- Name: TABLE iron_mines; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.iron_mines FROM administrator;
GRANT ALL ON TABLE public.iron_mines TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.iron_mines TO worldsuperpowers1;


--
-- Name: TABLE login_data; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.login_data FROM administrator;
GRANT ALL ON TABLE public.login_data TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.login_data TO worldsuperpowers1;


--
-- Name: TABLE markets; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.markets FROM administrator;
GRANT ALL ON TABLE public.markets TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.markets TO worldsuperpowers1;


--
-- Name: TABLE oil_fields; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.oil_fields FROM administrator;
GRANT ALL ON TABLE public.oil_fields TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.oil_fields TO PUBLIC;
GRANT ALL ON TABLE public.oil_fields TO worldsuperpowers1;


--
-- Name: TABLE parties; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.parties FROM administrator;
GRANT ALL ON TABLE public.parties TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.parties TO worldsuperpowers1;


--
-- Name: TABLE partyinvitations; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.partyinvitations FROM administrator;
GRANT ALL ON TABLE public.partyinvitations TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.partyinvitations TO worldsuperpowers1;


--
-- Name: TABLE pending_laws; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.pending_laws FROM administrator;
GRANT ALL ON TABLE public.pending_laws TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.pending_laws TO worldsuperpowers1;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.profiles FROM administrator;
GRANT ALL ON TABLE public.profiles TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.profiles TO PUBLIC;
GRANT ALL ON TABLE public.profiles TO worldsuperpowers1;


--
-- Name: TABLE provinces; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.provinces FROM administrator;
GRANT ALL ON TABLE public.provinces TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.provinces TO PUBLIC;
GRANT ALL ON TABLE public.provinces TO worldsuperpowers1;


--
-- Name: TABLE states; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.states FROM administrator;
GRANT ALL ON TABLE public.states TO administrator WITH GRANT OPTION;
GRANT SELECT ON TABLE public.states TO PUBLIC;
GRANT ALL ON TABLE public.states TO worldsuperpowers1;


--
-- Name: TABLE study; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.study FROM administrator;
GRANT ALL ON TABLE public.study TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.study TO worldsuperpowers1;


--
-- Name: TABLE upvotes; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.upvotes FROM administrator;
GRANT ALL ON TABLE public.upvotes TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.upvotes TO worldsuperpowers1;


--
-- Name: TABLE user_data; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.user_data FROM administrator;
GRANT ALL ON TABLE public.user_data TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.user_data TO worldsuperpowers1;


--
-- Name: TABLE votes; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.votes FROM administrator;
GRANT ALL ON TABLE public.votes TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.votes TO worldsuperpowers1;


--
-- Name: TABLE wars; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.wars FROM administrator;
GRANT ALL ON TABLE public.wars TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.wars TO worldsuperpowers1;


--
-- Name: TABLE working; Type: ACL; Schema: public; Owner: administrator
--

REVOKE ALL ON TABLE public.working FROM administrator;
GRANT ALL ON TABLE public.working TO administrator WITH GRANT OPTION;
GRANT ALL ON TABLE public.working TO worldsuperpowers1;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

