-module(idna_unicode).

-export([compose/1, decompose/1, downcase/1, normalize_kc/1, sort_canonical/1]).

%%============================================================================
%% Constants
%%============================================================================

-define(HANGUL_SBASE, 16#ac00).

-define(HANGUL_LBASE, 16#1100).

-define(HANGUL_LCOUNT, 19).

-define(HANGUL_VBASE, 16#1161).

-define(HANGUL_VCOUNT, 21).

-define(HANGUL_TBASE, 16#11a7).

-define(HANGUL_TCOUNT, 28).

-define(HANGUL_NCOUNT, 588). % ?HANGUL_VCOUNT * ?HANGUL_TCOUNT

-define(HANGUL_SCOUNT, 11172). % ?HANGUL_LCOUNT * ?HANGUL_NCOUNT

%%============================================================================
%% API
%%============================================================================

compose([]) ->
    [];
compose([Starter|Unicode]) ->
    StarterCC = case idna_unicode_data:combining_class(Starter) of 0 -> 0; _ -> 256 end,
    compose(Starter, StarterCC, Unicode, []).

decompose(Unicode) ->
    lists:reverse(lists:foldl(fun(CP, Acc) -> codepoint_decompose(CP, Acc) end, [], Unicode)).

downcase(Unicode) ->
    [codepoint_downcase(CP) || CP <- Unicode].

normalize_kc(Unicode) ->
    compose(sort_canonical(decompose(Unicode))).

sort_canonical(Unicode) ->
    Length = length(Unicode),
    case Length < 2 of
        true ->
            Unicode;
        false ->
            sort_canonical(array:from_list(Unicode), 1, Length)
    end.

%%============================================================================
%% Helper functions
%%============================================================================

compose(Starter, _, [], Acc) ->
    lists:reverse([Starter|Acc]);
compose(Starter, StarterCC, [CP|Unicode], Acc) ->
    Composite = compose_pair(Starter, CP),
    case StarterCC =:= 0 andalso Composite =/= undefined of
        true ->
            compose(Composite, idna_unicode_data:combining_class(Composite), Unicode, Acc);
        false ->
            compose(CP, idna_unicode_data:combining_class(CP), Unicode, [Starter|Acc])
    end.

compose_pair(A, B) when
        A >= ?HANGUL_LBASE andalso
        A < (?HANGUL_LBASE + ?HANGUL_LCOUNT) andalso
        B >= ?HANGUL_LBASE andalso
        B < (?HANGUL_VBASE + ?HANGUL_VCOUNT) ->
    ?HANGUL_SBASE + ((A - ?HANGUL_LBASE) * ?HANGUL_VCOUNT + (B - ?HANGUL_VBASE)) * ?HANGUL_TCOUNT;
compose_pair(A, B) when
        A >= ?HANGUL_SBASE andalso
        A < (?HANGUL_SBASE + ?HANGUL_SCOUNT) andalso
        ((A - ?HANGUL_SBASE) rem ?HANGUL_TCOUNT) =:= 0 andalso
        B >= ?HANGUL_TBASE andalso
        B < (?HANGUL_TBASE + ?HANGUL_TCOUNT) ->
    A + (B - ?HANGUL_TBASE);
compose_pair(A, B) ->
    idna_unicode_data:composition(A, B).

codepoint_decompose(CP, Acc) when CP >= ?HANGUL_SBASE andalso CP < (?HANGUL_SBASE + ?HANGUL_SCOUNT) ->
    lists:reverse(decompose_hangul(CP), Acc);
codepoint_decompose(CP, Acc) ->
    case idna_unicode_data:compat(CP) of
        {error, bad_codepoint} ->
            [CP|Acc];
        undefined ->
            [CP|Acc];
        Codepoints ->
            lists:reverse(decompose(Codepoints), Acc)
    end.

decompose_hangul(CP) ->
    Sindex = CP - ?HANGUL_SBASE,
    case (Sindex < 0 orelse Sindex >= ?HANGUL_SCOUNT) of
        true ->
            [CP];
        false ->
            L = ?HANGUL_LBASE + Sindex div ?HANGUL_NCOUNT,
            V = ?HANGUL_VBASE + (Sindex rem ?HANGUL_NCOUNT) div ?HANGUL_TCOUNT,
            T = ?HANGUL_TBASE + Sindex rem ?HANGUL_TCOUNT,
            case T =:= ?HANGUL_TBASE of
                true ->
                    [L, V];
                false ->
                    [L, V, T]
            end
    end.

codepoint_downcase(CP) ->
    case idna_unicode_data:lowercase(CP) of
        {error, bad_codepoint} ->
            CP;
        Lowercase ->
            Lowercase
    end.

sort_canonical(Unicode, I, Length) ->
    case I < Length of
        true ->
            array:to_list(Unicode);
        false ->
            Last = array:get(I - 1, Unicode),
            CP = array:get(I, Unicode),
            LastCC = idna_unicode_data:combining_class(Last),
            CC = idna_unicode_data:combining_class(CP),
            case CC =/= 0 andalso LastCC =/= 0 andalso LastCC > CC of
                true ->
                    NextI = case I > 1 of true -> I - 1; false -> I end,
                    sort_canonical(array:set(I - 1, CP, array:set(I, Last, Unicode)), NextI, Length);
                false ->
                    sort_canonical(Unicode, I + 1, Length)
            end
    end.
