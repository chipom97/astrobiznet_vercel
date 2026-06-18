// AstroBizNet — Supabase storage + realtime sync
// Everyone shares one board. Changes broadcast live to all open screens.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vdjdkrqwaqawmsxhshok.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1ZctFvAii716LzmmX-bnZQ_hX1LqY09";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const impl = {
  async get(key) {
    try {
      const { data, error } = await supabase
        .from("board")
        .select("data")
        .eq("id", key)
        .maybeSingle();
      if (error || !data) return null;
      return { key, value: JSON.stringify(data.data), shared: true };
    } catch (e) {
      return null;
    }
  },

  async set(key, value) {
    try {
      const parsed = JSON.parse(value);
      const { error } = await supabase.from("board").upsert({ id: key, data: parsed });
      if (error) return null;
      return { key, value, shared: true };
    } catch (e) {
      return null;
    }
  },

  async delete(key) {
    try {
      await supabase.from("board").delete().eq("id", key);
      return { key, deleted: true, shared: true };
    } catch (e) {
      return null;
    }
  },

  async list() {
    return { keys: [], shared: true };
  },

  // Live updates: calls cb(jsonString) whenever this key changes in the DB.
  // Returns an unsubscribe function.
  subscribe(key, cb) {
    try {
      const channel = supabase
        .channel("board_" + key)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "board", filter: `id=eq.${key}` },
          (payload) => {
            if (payload.new && payload.new.data) {
              cb(JSON.stringify(payload.new.data));
            }
          }
        )
        .subscribe();
      return () => supabase.removeChannel(channel);
    } catch (e) {
      return () => {};
    }
  },
};

if (typeof window !== "undefined" && !window.storage) {
  window.storage = impl;
}

export default impl;
