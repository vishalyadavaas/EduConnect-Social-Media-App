import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { theme } from "../constants/theme";

const RichTextEditor = ({ editorRef, onChange }) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.undo,
          actions.redo,
          actions.alignCenter,
          actions.alignLeft,
          actions.alignRight,
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.setStrikethrough,
          actions.removeFormat,
          actions.blockquote,
          actions.line,
          actions.heading1,
          actions.heading2,
          actions.heading3,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H1</Text>
          ),
          [actions.heading2]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H2</Text>
          ),
          [actions.heading3]: ({ tintColor }) => (
            <Text style={{ color: tintColor }}>H3</Text>
          ),
        }}
        style={styles.richBar}
        flatContainerStyle={styles.flatStyle}
        selectedIconTint={'#2095F2'}
        disabledIconTint={'#8b8b8b'}
        editor={editorRef}
        disabled={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder="What's on your mind?"
        onChange={onChange}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopRightRadius: theme.radius.xl,
    borderTopLeftRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 200,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  contentStyle: {
    color: theme.colors.textDark,
    placeholderColor: 'gray',
    backgroundColor: theme.colors.lightGray,
    fontSize: 16,
    lineHeight: 22,
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
});
